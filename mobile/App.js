import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import i18n from 'i18next';
import { WebRTC } from 'react-native-webrtc';
import { VideoPlayer } from 'react-native-video';
import { fetch } from './api';

i18n.init({
  resources: {
    navajo: { translation: { welcome: "Yáʼátʼééchąąʼí, [User], níłchʼįʼííłtsąąʼí" } },
    anishinaabe: { translation: { welcome: "Boozhoo, [User], gichi-ayaabe" } },
    cree: { translation: { welcome: "Tânisi, [User], kîya mâna" } },
    inuktitut: { translation: { welcome: "Ullukkut, [User], angutiit" } },
    ojibwe: { translation: { welcome: "Aaniin, [User], gichi-manidoo" } }
  }
});

const App = ({ user }) => {
  const [ritual, setRitual] = useState(null);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    fetch(`${process.env.API_URL}/api/indigenous-ritual`, {
      headers: { Authorization: `Bearer ${user.token}`, 'X-DID': user.did },
      body: JSON.stringify({ tradition: user.tradition, language: user.language })
    }).then(res => res.json()).then(setRitual);

    fetch(`${process.env.API_URL}/api/plant-medicines`, {
      headers: { Authorization: `Bearer ${user.token}`, 'X-DID': user.did },
      body: JSON.stringify({ tradition: user.tradition })
    }).then(res => res.json()).then(setPlants);
  }, [user]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        {i18n.t('welcome', { lng: user.language }).replace('[User]', user.name)}
      </Text>
      <Text style={{ fontSize: 18, marginTop: 10 }}>
        {ritual ? `Ritual: ${ritual.name} (${user.language})` : 'Loading ritual...'}
      </Text>
      <FlatList
        data={plants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>{item.name} (e.g., Sage, Sweetgrass)</Text>
            {item.preparationVideo && (
              <VideoPlayer
                source={{ uri: item.preparationVideo }}
                style={{ width: '100%', height: 200 }}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default App;
