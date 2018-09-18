// The following function is an adapted version of
//
// https://github.com/openlayers/openlayers/blob/cda0fe6e41074ec7a81c064513606f297406a76a/examples/vector-esri.js#L58
//
// The following license applies to it:
// Copyright 2005-present OpenLayers Contributors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this
// list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice,
// this list of conditions and the following disclaimer in the documentation and/or
// other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY OPENLAYERS CONTRIBUTORS ``AS IS'' AND ANY EXPRESS
// OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
// SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
// LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
// OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those
// of the authors and should not be interpreted as representing official policies,
// either expressed or implied, of OpenLayers Contributors.
//

function tiledVectorLayer(baseUrl, size) {
  let source = null;
  source = new ol.source.Vector({
    loader: function (extent, resolution, projection) {
      let url = baseUrl + '/query?f=geojson&' +
        'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
        encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
          extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
          ',"spatialReference":{"wkid":4326}}') +
        '&geometryType=esriGeometryEnvelope&inSR=4326&outFields=*' +
        '&outSR=4326';
      $.ajax({
        url: url, dataType: 'json', success: function (response) {
          if (response.error) {
            alert(response.error.message + '\n' +
              response.error.details.join('\n'));
          } else {
            var features = (new ol.format.GeoJSON()).readFeatures(response);
            if (features.length > 0) {
              source.addFeatures(features);
            }
          }
        }
      });
    },
    strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
      tileSize: size
    }))
  })
  return source;
}