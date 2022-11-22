import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf

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
        shuffle=True,
        label_mode='categorical',
        batch_size=BATCH_SIZE,
        image_size=(IMG_SIZE, IMG_SIZE),
    )

    # train / test split with 10:1
    all_batches = tf.data.experimental.cardinality(datasets)
    test_dataset = datasets.take(all_batches // 10)
    train_dataset = datasets.skip(all_batches // 10)

    # prefetch
    AUTOTUNE = tf.data.AUTOTUNE

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
    epochs=5

    history = model.fit(
        train_dataset,
        batch_size=BATCH_SIZE,
        epochs=epochs,
        validation_data=test_dataset,
    )

    model.save_weights('EfficientNetB0_Hiragana.h5')

    # print(model.summary())

    # visualize the results
    # acc = history.history['accuracy']
    # val_acc = history.history['val_accuracy']
    # loss = history.history['loss']
    # val_loss = history.history['val_loss']

    # plt.figure(figsize=(8, 8))
    # plt.subplot(2, 1, 1)
    # plt.plot(acc, label='Training Accuracy')
    # plt.plot(val_acc, label='Validation Accuracy')
    # plt.legend(loc='lower right')
    # plt.ylabel('Accuracy')
    # plt.ylim([min(plt.ylim()),1])
    # plt.title('Training and Validation Accuracy')

    # plt.subplot(2, 1, 2)
    # plt.plot(loss, label='Training Loss')
    # plt.plot(val_loss, label='Validation Loss')
    # plt.legend(loc='upper right')
    # plt.ylabel('Cross Entropy')
    # plt.ylim([0,1.0])
    # plt.title('Training and Validation Loss')
    # plt.xlabel('epoch')
    
    # plt.savefig('results.png')
    # plt.show()

    # evaluate the model using test_dataset
    loss, accuracy = model.evaluate(test_dataset)
    print('Test accuracy :', accuracy)

if __name__ == '__main__':
    main()