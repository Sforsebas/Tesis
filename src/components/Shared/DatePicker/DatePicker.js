import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./DatePicker.styles";

export function DatePickerComponent({ onDateChange, onTimeChange }) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const onDateChangeHandler = (event, selectedDate) => {
    setShowDate(false);
    if (selectedDate) {
      // Truncar la hora para que solo se guarde la fecha
      const truncatedDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setDate(truncatedDate);
      if (onDateChange) onDateChange(truncatedDate); // Pasa solo la fecha sin la hora
    }
  };

  const onTimeChangeHandler = (event, selectedTime) => {
    setShowTime(false);
    if (selectedTime) {
      setTime(selectedTime);
      if (onTimeChange) onTimeChange(formatTime(selectedTime)); // Pasar el formato HH:mm
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Solo devuelve la fecha, no la hora
  };

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View>
      {/* Botón para seleccionar la fecha */}
      <TouchableOpacity style={styles.btn} onPress={() => setShowDate(true)}>
        <View style={styles.textContainer}>
          <Text style={styles.btnText}>
            Seleccionar Fecha: {formatDate(date)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botón para seleccionar la hora */}
      <TouchableOpacity
        style={[styles.btn, styles.btnSpacing]}
        onPress={() => setShowTime(true)}
      >
        <View style={styles.textContainer}>
          <Text style={styles.btnText}>
            Seleccionar Hora: {formatTime(time)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Selector de fecha */}
      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChangeHandler}
        />
      )}

      {/* Selector de hora */}
      {showTime && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChangeHandler}
        />
      )}
    </View>
  );
}
