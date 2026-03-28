import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

interface CameraResult {
  uri: string;
  width: number;
  height: number;
  base64?: string;
}

export function useCamera() {
  const [photo, setPhoto] = useState<CameraResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const takePhoto = useCallback(async (): Promise<CameraResult | null> => {
    setIsProcessing(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Kamera izni gerekiyor!');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const photoData: CameraResult = {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          base64: result.assets[0].base64 || undefined,
        };
        setPhoto(photoData);
        return photoData;
      }
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const pickImage = useCallback(async (): Promise<CameraResult | null> => {
    setIsProcessing(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Galeri izni gerekiyor!');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const photoData: CameraResult = {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          base64: result.assets[0].base64 || undefined,
        };
        setPhoto(photoData);
        return photoData;
      }
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearPhoto = useCallback(() => {
    setPhoto(null);
  }, []);

  return {
    photo,
    isProcessing,
    takePhoto,
    pickImage,
    clearPhoto,
  };
}
