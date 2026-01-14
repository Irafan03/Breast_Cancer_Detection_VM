from tensorflow.keras.models import Model
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout, BatchNormalization
from tensorflow.keras.applications import ResNet50
import cv2
import numpy as np

IMG_SIZE = (50, 50)

def create_model(input_shape=(50, 50, 3)):
    base_model = ResNet50(weights='imagenet', include_top=False, input_shape=input_shape)
    for layer in base_model.layers[:-20]:
        layer.trainable = False
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(256, activation='relu')(x)
    x = BatchNormalization()(x)
    x = Dropout(0.5)(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(1, activation='sigmoid')(x)
    model = Model(inputs=base_model.input, outputs=predictions)
    return model

model = create_model()
model.load_weights("idc_breast_cancer_model_final/model.weights.h5")
print("Modèle chargé avec succès ")

def predict_from_bytes(image_bytes):

    npimg = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, IMG_SIZE)
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=0)

    proba = model.predict(img, verbose=0)[0][0]
    label = "IDC POSITIF (Cancer)" if proba > 0.5 else "IDC NÉGATIF (Pas de cancer)"

    return {"label": label, "confidence": float(proba)}