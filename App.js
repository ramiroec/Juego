import React, { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import { View, Button, Text, StyleSheet } from 'react-native';

export default function AnimatedStyleUpdateExample() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // Tiempo inicial de 30 segundos
  const randomWidth = useSharedValue(100);
  const randomHeight = useSharedValue(80);
  const boxColor = useSharedValue('black'); // Color del cuadro

  // Configuración para las animaciones
  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
      height: withTiming(randomHeight.value, config),
      backgroundColor: boxColor.value, // Cambiar color en base al tamaño
      transform: [{ rotate: withSpring(`${randomWidth.value / 10}deg`) }], // Rotar el cuadro
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1); // Reducir el tiempo
      } else {
        clearInterval(interval); // Detener el temporizador cuando se acabe
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handlePress = () => {
    const newWidth = Math.random() * 350;
    const newHeight = Math.random() * 150 + 50; // Altura aleatoria para más variedad
    randomWidth.value = newWidth;
    randomHeight.value = newHeight;

    // Cambiar color dependiendo del tamaño
    if (newWidth > 250) {
      boxColor.value = 'red';
    } else if (newWidth > 150) {
      boxColor.value = 'yellow';
    } else {
      boxColor.value = 'black';
    }

    // Aumentar puntaje si el tamaño es grande
    if (newWidth > 200) {
      setScore(score + 1);
    }
  };

  // Función para reiniciar el juego
  const restartGame = () => {
    setScore(0); // Reiniciar puntaje
    setTimeLeft(30); // Restablecer el tiempo
    randomWidth.value = 100; // Resetear el tamaño
    randomHeight.value = 80;
    boxColor.value = 'black'; // Restablecer color
  };

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Puntaje: {score}</Text>
      <Text style={styles.timerText}>Tiempo restante: {timeLeft}s</Text>
      <Animated.View style={[styles.box, style]} />
      <Button title="Cambiar tamaño" onPress={handlePress} disabled={timeLeft === 0} />
      
      {/* Mostrar mensaje dependiendo del puntaje cuando el tiempo se acabe */}
      {timeLeft === 0 && score > 5 && (
        <Text style={styles.congratulations}>¡Felicidades, gran puntaje!</Text>
      )}
      {timeLeft === 0 && score <= 5 && (
        <Text style={styles.tryAgain}>¡Intenta de nuevo!</Text>
      )}

      {/* Botón para reiniciar el juego */}
      {timeLeft === 0 && (
        <Button title="Volver a jugar" onPress={restartGame} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 20,
    marginBottom: 20,
  },
  box: {
    margin: 30,
    borderRadius: 10, // Bordes redondeados para más estilo
  },
  congratulations: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
    marginTop: 20,
  },
  tryAgain: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 20,
  },
});
