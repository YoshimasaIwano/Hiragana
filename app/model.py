import tensorflow as tf

class EfficientHiragana(tf.keras.Model):
    def __init__(self, img_size, output_shape):
        super().__init__()
        self.input_layer = tf.keras.layers.Conv2D(filters=3, kernel_size=2, strides=1, padding='same')
        self.model = tf.keras.applications.efficientnet.EfficientNetB0(input_shape=(img_size,img_size,3), include_top=False, weights='imagenet')
        self.flatten = tf.keras.layers.Flatten()
        self.fc = tf.keras.layers.Dense(output_shape)
        self.softmax = tf.keras.layers.Softmax(axis=-1)

    def call(self, inputs):
        preprocess_input = tf.keras.applications.efficientnet.preprocess_input
        x = preprocess_input(inputs)
        x = self.input_layer(x)
        x = self.model(x)
        x = self.flatten(x)
        x = self.fc(x)
        x = self.softmax(x)
        return x

