import { BarCodeScanner } from 'expo-barcode-scanner';

export async function requestScannerPermission() {
  return BarCodeScanner.requestPermissionsAsync();
}
