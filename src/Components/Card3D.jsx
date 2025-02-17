import React, { useState, useRef } from "react";
import { Image } from "antd";

const Card3D = ({ card }) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState("");

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    // Mittelpunkt der Karte ermitteln
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    // Abstand des Cursors vom Mittelpunkt
    const deltaX = e.clientX - cardCenterX;
    const deltaY = e.clientY - cardCenterY;
    // Berechne die Rotationswinkel – anpassen, um den Effekt zu verstärken oder abzuschwächen
    const rotateX = (deltaY / rect.height) * 20; // je höher der Faktor, desto stärker die Rotation um X
    const rotateY = -(deltaX / rect.width) * 20; // negiert, um in die richtige Richtung zu rotieren
    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <Image
      ref={cardRef}
      className="card-3d"
      src={card.images.large}
      width={300}
      preview={false}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
    </Image>
  );
};

export default Card3D;
