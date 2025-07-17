import React, { useState, useEffect } from 'react';
import { BabylonScene } from 'babylon.js';

const SoulMeshMap = ({ user }) => {
  const [mapData, setMapData] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/api/soulmesh`, {
      headers: { Authorization: `Bearer ${token}`, 'X-DID': user.did }
    }).then(res => res.json()).then(setMapData);
  }, []);
  return (
    <BabylonScene>
      {mapData.map(node => (
        <Mesh key={node.id} position={node.position} material={{ color: node.indigenous ? 'earth-tone' : 'soul-color' }} />
      ))}
    </BabylonScene>
  );
};

export default SoulMeshMap;
