import React from "react";
import { View } from "react-native";
import { Text, ListItem, Icon } from "react-native-elements";
import { map } from "lodash";
import { Map } from "../../Shared";
import { styles } from "./Info.styles";

export function Info(props) {
  const { espaciodeportivo } = props;

  const listInfo = [
    {
      text: espaciodeportivo.address,
      iconType: "material-community",
      iconName: "map-marker",
    },
    {
      text: espaciodeportivo.phone,
      iconType: "material-community",
      iconName: "phone",
    },
    {
      text: espaciodeportivo.email,
      iconType: "material-community",
      iconName: "at",
    },
  ];

  return (
    <View style={styles.content}>
      <Text style={styles.title}> Información sobre el Espacio Deportivo</Text>
      <Map location={espaciodeportivo.location} name={espaciodeportivo.name} />
      {map(listInfo, (item, index) => (
        <ListItem key={index} bottomDivider>
          <Icon type={item.iconType} name={item.iconName} color="#1B2E51" />
          <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
}
