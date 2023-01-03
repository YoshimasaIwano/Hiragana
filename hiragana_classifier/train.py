'''
    For the training the model.

    Author: YoshimasaIwano
'''

import tensorflow as tf
from tensorflow.keras import layers
# import albumentations as A
# from functools import partial
import os

from model import EfficientHiragana

def main():
    # hyper parameters
    BATCH_SIZE=512
    IMG_SIZE=48

    # load images
    PATH = os.path.dirname(os.path.realpath(__file__))
    data_dir = os.path.join(PATH, 'datasets')
    datasets = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        labels='inferred',
        shuffle=True,
        label_mode='categorical',
        batch_size=BATCH_SIZE,
        image_size=(IMG_SIZE, IMG_SIZE),
    )

    # class_names = datasets.class_names
    # print(class_names)
    # class_names = ['a', 'e', 'ha', 'he', 'hi', 'ho', 'hu', 'i', 'ka', 'ke', 'ki', 'ko', 'ku', 'ma', 'me', 'mi', 'mo', 'mu', 'na', 'ne', 'ni', 'nn', 'no', 'nu', 'o', 'ra', 're', 'ri', 'ro', 'ru', 'sa', 'se', 'si', 'so', 'su', 'ta', 'te', 'ti', 'to', 'tu', 'u', 'wa', 'wo', 'ya', 'yo', 'yu']

    # train / test split with 10:1
    all_batches = tf.data.experimental.cardinality(datasets)
    test_dataset = datasets.take(all_batches // 100)
    train_dataset = datasets.skip(all_batches // 100)

    # prefetch
    AUTOTUNE = tf.data.AUTOTUNE

    # data augumentation
    data_augmentation = tf.keras.Sequential([
        layers.RandomZoom(height_factor=(-0.3, 0.3), width_factor=(-0.3, 0.3), fill_mode='reflect'),
        layers.RandomRotation(factor=(-0.1, 0.1), fill_mode='reflect'),
    ])

    train_dataset = train_dataset.repeat(2)
    train_dataset = train_dataset.map(lambda x, y: (data_augmentation(x, training=True), y))

    # # albumentations
    # transform = A.Compose([
    #     A.CropAndPad(percent=(0.2, 0.3), p=0.5)
    # ])

    # def augmentations(image, label):
    #     aug_data = transform(image)
    #     return aug_data, label

    # aug_train_dataset = train_dataset.map(partial(augmentations))

    train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
    test_dataset = test_dataset.prefetch(buffer_size=AUTOTUNE)

    # create model
    input_shape = IMG_SIZE 
    output_shape = 46
    model = EfficientHiragana(input_shape, output_shape)
    optimizer = tf.keras.optimizers.Adam()
    model.compile(
        optimizer=optimizer,
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # freeze the 100 layers to fine-tuning
    model.trainable = True
    print("Number of layers in the base model: ", len(model.layers))
    # fine_tune_at = 100
    # for layer in model.layers[:fine_tune_at]:
    #   layer.trainable = False

    # train model 
    epochs=3

    history = model.fit(
        train_dataset,
        batch_size=BATCH_SIZE,
        epochs=epochs,
        validation_data=test_dataset,
    )

    model.save_weights('EfficientNetB0_Hiragana.h5')

    # evaluate the model using test_dataset
    loss, accuracy = model.evaluate(test_dataset)
    print('Test accuracy :', accuracy)
    print('Test loss :', loss)

    return 0

if __name__ == '__main__':
    main()