import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import i18n from 'i18next';
import { WebXR } from 'react-native-webxr';
import { WebRTC } from 'react-native-webrtc';
import { fetch } from '../api';

const HealingRituals = ({ user }) => {
  const [rituals, setRituals] = useState([]);
  const [selectedRitual, setSelectedRitual] = useState(null);

  useEffect(() => {
    fetch(`${process.env.API_URL}/api/indigenous-rituals`, {
      headers: { Authorization: `Bearer ${user.token}`, 'X-DID': user.did },
      body: JSON.stringify({ tradition: user.tradition, language: user.language })
    }).then(res => res.json()).then(setRituals);
  }, [user]);

  const startRitual = async (ritual) => {
    setSelectedRitual(ritual);
    if (ritual.type === 'talking-circle') {
      await WebRTC.joinCircle(ritual.id, user);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        {i18n.t('healingRituals', { lng: user.language })}
      </Text>
      {selectedRitual ? (
        <WebXR.Experience uri={selectedRitual.arUri}>
          <Text>{selectedRitual.name} ({selectedRitual.language})</Text>
        </WebXR.Experience>
      ) : (
        <FlatList
          data={rituals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => startRitual(item)}>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                {item.name} (e.g., {item.type === 'sweat-lodge' ? 'Sweat Lodge' : 'Smudging'})
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default HealingRituals;
