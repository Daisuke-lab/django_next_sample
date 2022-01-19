/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import React from "react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Image, Text, View } from "@aws-amplify/ui-react";
export default function Header(props) {
  const { label, src, overrides: overridesProp, ...rest } = props;
  const overrides = { ...overridesProp };
  return (
    <View
      width="1440px"
      height="74px"
      position="relative"
      padding="0px 0px 0px 0px"
      {...rest}
      {...getOverrideProps(overrides, "View")}
    >
      <View
        width="1440px"
        height="74px"
        position="absolute"
        left="0px"
        top="0px"
        padding="0px 0px 0px 0px"
        {...getOverrideProps(overrides, "View.View[0]")}
      >
        <View
          width="1440px"
          height="74px"
          position="absolute"
          left="0px"
          top="0px"
          padding="0px 0px 0px 0px"
          backgroundColor="rgba(250.00000029802322,250.00000029802322,250.00000029802322,1)"
          title="test"
          {...getOverrideProps(overrides, "View.View[0].View[0]")}
        ></View>
        <View
          padding="0px 0px 0px 0px"
          width="250px"
          height="29px"
          position="absolute"
          left="283px"
          top="23px"
          {...getOverrideProps(overrides, "View.View[0].View[1]")}
        >
          <Text
            fontFamily="Noto Sans JP"
            fontSize="20px"
            fontWeight="500"
            color="rgba(41.00000135600567,41.00000135600567,41.00000135600567,1)"
            lineHeight="23.4375px"
            textAlign="left"
            display="flex"
            direction="column"
            justifyContent="flex-start"
            position="absolute"
            left="30px"
            top="0px"
            padding="0px 0px 0px 0px"
            children="test"
            {...getOverrideProps(overrides, "View.View[0].View[1].Text[0]")}
          ></Text>
          <Image
            width="22px"
            height="22px"
            position="absolute"
            transformOrigin="top left"
            transform="matrix(-1, 0, 0, 1, 22, 3)"
            padding="0px 0px 0px 0px"
            src="test"
            {...getOverrideProps(overrides, "View.View[0].View[1].Image[0]")}
          ></Image>
        </View>
      </View>
    </View>
  );
}
