import { ArcGisMapServerImageryProvider, Viewer } from 'cesium';
import './index.css';
import TIFFImageryProvider from 'tiff-imagery-provider';

const viewer = new Viewer('cesiumContainer', {
  baseLayerPicker: false,
  animation: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  selectionIndicator: true,
  timeline: false,
  navigationHelpButton: false,
  shouldAnimate: true,
  useBrowserRecommendedResolution: false,
  orderIndependentTranslucency: false,
});

const imageryProvider = new ArcGisMapServerImageryProvider({
  url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
  enablePickFeatures: false
});

viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
viewer.imageryLayers.addImageryProvider(imageryProvider)

const provider: any = await TIFFImageryProvider.fromUrl('./cogtif.tif', {
  renderOptions: {
    single: {
      colorScale: 'rainbow'
    }
  },
  enablePickFeatures: true
});

const imageryLayer = viewer.imageryLayers.addImageryProvider(provider);
viewer.flyTo(imageryLayer, {
  duration: 1,
});