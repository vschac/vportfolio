import React, { useState, useEffect } from 'react';

const AsteroidGame = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [score, setScore] = useState(0);

  // Generate a random asteroid
  const createAsteroid = () => {
    const size = Math.random() * (80 - 50) + 50;
    const direction = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    
    // Calculate starting position based on direction
    let startX, startY, endX, endY;
    
    switch(direction) {
      case 0: // top
        startX = Math.random() * 100;
        startY = -10;
        endX = Math.random() * 100;
        endY = 110;
        break;
      case 1: // right
        startX = 110;
        startY = Math.random() * 100;
        endX = -10;
        endY = Math.random() * 100;
        break;
      case 2: // bottom
        startX = Math.random() * 100;
        startY = 110;
        endX = Math.random() * 100;
        endY = -10;
        break;
      default: // left
        startX = -10;
        startY = Math.random() * 100;
        endX = 110;
        endY = Math.random() * 100;
        break;
    }
    
    return {
      id: Date.now() + Math.random(),
      size,
      startX,
      startY,
      endX,
      endY,
      direction,
      duration: Math.random() * (15 - 10) + 10,
      isExploding: false,
      createdAt: Date.now() // Add timestamp for cleanup
    };
  };

  // Handle asteroid click
  const handleClick = (id, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const heroSection = event.currentTarget.closest('.hero-section');
    const rect = heroSection.getBoundingClientRect();
    
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    setAsteroids(prev => prev.map(asteroid => 
      asteroid.id === id 
        ? { 
            ...asteroid, 
            isExploding: true,
            explodeX: clickX,
            explodeY: clickY
          }
        : asteroid
    ));
    
    setTimeout(() => {
      setAsteroids(prev => prev.filter(asteroid => asteroid.id !== id));
      setScore(prev => prev + 1);
    }, 500);
  };

  // Spawn new asteroids periodically
  useEffect(() => {
    setAsteroids([createAsteroid(), createAsteroid(), createAsteroid()]);

    const spawnInterval = setInterval(() => {
      setAsteroids(prev => {
        if (prev.length < 5) {
          const newAsteroids = [...prev];
          const numToSpawn = Math.min(2, 8 - prev.length);
          
          for (let i = 0; i < numToSpawn; i++) {
            newAsteroids.push(createAsteroid());
          }
          return newAsteroids;
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, []);

  // Clean up asteroids that have completed their animation
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setAsteroids(prev => prev.filter(asteroid => {
        // Remove asteroids that have been alive longer than their duration
        const lifetime = now - asteroid.createdAt;
        const maxLifetime = asteroid.duration * 1000 + 1000; // duration in ms + buffer
        
        // Keep asteroid if it's exploding or hasn't completed its animation
        return asteroid.isExploding || lifetime < maxLifetime;
      }));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="asteroid-game">
      <div className="game-info">
        <div className="score">Score: {score}</div>
      </div>
      {asteroids.map(asteroid => (
        <div
          key={asteroid.id}
          id={`asteroid-${asteroid.id}`}
          className={`asteroid ${asteroid.isExploding ? 'exploding' : ''}`}
          style={{
            '--size': `${asteroid.size}px`,
            '--start-x': `${asteroid.startX}%`,
            '--start-y': `${asteroid.startY}%`,
            '--end-x': `${asteroid.endX}%`,
            '--end-y': `${asteroid.endY}%`,
            '--duration': `${asteroid.duration}s`,
            '--explode-x': asteroid.explodeX ? `${asteroid.explodeX}px` : '0',
            '--explode-y': asteroid.explodeY ? `${asteroid.explodeY}px` : '0',
          }}
          onClick={(e) => handleClick(asteroid.id, e)}
        >
          <div className="asteroid-body" />
        </div>
      ))}
    </div>
  );
};

export default AsteroidGame; 