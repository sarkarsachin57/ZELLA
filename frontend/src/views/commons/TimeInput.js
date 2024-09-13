import React, { Component } from "react";
import MaskedInput from "react-text-mask";

export default class TextInput extends Component {
  checkHours = value => {
    if (value[0] === "2") {
      return /[0-3]/;
    } else {
      return /[0-9]/;
    }
  };

  render() {
    const { inputRef, ...other } = this.props;
    console.log(other);
    return (
      <MaskedInput
        {...other}
        ref={ref => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={[
          /[0-2]/,
          this.checkHours(other.value),
          ":",
          /[0-5]/,
          /\d/,
          ":",
          /[0-5]/,
          /\d/,
          ":",
          /[0-5]/,
          /\d/
        ]}
        placeholder="HH:MM:SS:FRAMES"
      />
    );
  }
}
