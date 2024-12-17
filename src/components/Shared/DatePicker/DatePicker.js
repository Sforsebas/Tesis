import React, { useState } from "react";
import { View, Button } from "react-native";
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
      setDate(selectedDate); // Actualiza la fecha seleccionada
      if (onDateChange) onDateChange(selectedDate); // Notifica al componente padre
    }
  };

  const onTimeChangeHandler = (event, selectedTime) => {
    setShowTime(false);
    if (selectedTime) {
      setTime(selectedTime); // Actualiza la hora seleccionada
      if (onTimeChange) onTimeChange(selectedTime); // Notifica al componente padre
    }
  };

  return (
    <View>
      {/* Botón para seleccionar la fecha */}
      <View style={styles.btnContainer}>
        <Button
          title={`Seleccionar Fecha: ${date.toLocaleDateString()}`}
          onPress={() => setShowDate(true)}
          color={styles.btn.backgroundColor} // Usa el color definido en styles
        />
      </View>

      {/* Botón para seleccionar la hora */}
      <View style={styles.btnContainer}>
        <Button
          title={`Seleccionar Hora: ${time.toLocaleTimeString()}`}
          onPress={() => setShowTime(true)}
          color={styles.btn.backgroundColor} // Usa el color definido en styles
        />
      </View>

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
