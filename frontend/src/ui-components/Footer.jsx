/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import React from "react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Text, View } from "@aws-amplify/ui-react";
export default function Footer(props) {
  const { label, overrides: overridesProp, ...rest } = props;
  const overrides = { ...overridesProp };
  return (
    <View
      width="1198px"
      height="74px"
      position="relative"
      padding="0px 0px 0px 0px"
      {...rest}
      {...getOverrideProps(overrides, "View")}
    >
      <View
        width="1198px"
        height="74px"
        position="absolute"
        left="0px"
        top="0px"
        padding="0px 0px 0px 0px"
        {...getOverrideProps(overrides, "View.View[0]")}
      >
        <View
          width="1198px"
          height="74px"
          position="absolute"
          left="0px"
          top="0px"
          padding="0px 0px 0px 0px"
          backgroundColor="rgba(250.00000029802322,250.00000029802322,250.00000029802322,1)"
          {...getOverrideProps(overrides, "View.View[0].View[0]")}
        ></View>
        <View
          padding="0px 0px 0px 0px"
          width="222px"
          height="45px"
          position="absolute"
          left="488px"
          top="14px"
          {...getOverrideProps(overrides, "View.View[0].View[1]")}
        >
          <View
            width="222px"
            height="45px"
            position="absolute"
            left="0px"
            top="0px"
            borderRadius="5px"
            padding="0px 0px 0px 0px"
            backgroundColor="rgba(204.00000303983688,204.00000303983688,204.00000303983688,1)"
            {...getOverrideProps(overrides, "View.View[0].View[1].View[0]")}
          ></View>
          <Text
            fontFamily="Noto Sans JP"
            fontSize="18px"
            fontWeight="700"
            color="rgba(255,255,255,1)"
            lineHeight="21.09375px"
            textAlign="center"
            display="flex"
            direction="column"
            justifyContent="flex-start"
            width="115px"
            position="absolute"
            left="54px"
            top="9px"
            padding="0px 0px 0px 0px"
            children="test"
            {...getOverrideProps(overrides, "View.View[0].View[1].Text[0]")}
          ></Text>
        </View>
      </View>
    </View>
  );
}
