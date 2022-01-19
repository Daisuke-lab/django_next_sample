/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import React from "react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Icon, Text, View } from "@aws-amplify/ui-react";
export default function Helpmark(props) {
  const { overrides: overridesProp, ...rest } = props;
  const overrides = { ...overridesProp };
  return (
    <View
      width="16px"
      height="17px"
      position="relative"
      padding="0px 0px 0px 0px"
      {...rest}
      {...getOverrideProps(overrides, "View")}
    >
      <Icon
        width="16px"
        height="16px"
        pathData="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z"
        viewBox={{ minX: 0, minY: 0, width: 16, height: 16 }}
        color="rgba(30.00000011175871,49.00000087916851,59.00000028312206,1)"
        position="absolute"
        left="0px"
        top="1px"
        {...getOverrideProps(overrides, "View.Icon[0]")}
      ></Icon>
      <Text
        fontFamily="Noto Sans JP"
        fontSize="12px"
        fontWeight="700"
        color="rgba(255,255,255,1)"
        lineHeight="14.0625px"
        textAlign="left"
        display="flex"
        direction="column"
        justifyContent="flex-start"
        position="absolute"
        left="2px"
        top="0px"
        padding="0px 0px 0px 0px"
        children="？"
        {...getOverrideProps(overrides, "View.Text[0]")}
      ></Text>
    </View>
  );
}
