import { ArcGisMapServerImageryProvider, Viewer } from 'cesium';
import './index.css';
import TIFFImageryProvider from 'tiff-imagery-provider';
import proj4 from 'proj4-fully-loaded';

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

ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer', {
  enablePickFeatures: false
}).then(async imageryProvider => {
  viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
  viewer.imageryLayers.addImageryProvider(imageryProvider)
  const provider: any = await TIFFImageryProvider.fromUrl('/cogtif.tif', {
    enablePickFeatures: true,
    renderOptions: {
      single: {
        colorScale: 'rainbow',
      }
    },
    projFunc: (code) => {
      if (![4326, 3857, 900913].includes(code)) {
        {
          try {
            let prj = proj4("EPSG:4326", `EPSG:${code}`,)
            if (prj) return {
              project: prj.forward,
              unproject: prj.inverse
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
      return undefined
    },
  });

  const imageryLayer = viewer.imageryLayers.addImageryProvider(provider);
  viewer.flyTo(imageryLayer, {
    duration: 1,
  });
})
