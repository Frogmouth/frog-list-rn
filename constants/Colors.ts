

export const light = {
  'text': 'rgb(1, 2, 35)',
  'textInverted' : 'rgb(255, 255, 255)',
  'background': 'rgb(249, 249, 249)',
  'borderLight': 'rgb(195, 196, 203)',
  'primary': 'rgb(46, 137, 248)',
  'secondary': 'rgb(255, 214, 66)',
  'accent': 'rgb(250, 66, 235)',
  'formControl' : 'rgb(250, 250, 250)',
  'formControlFocused' : 'rgba(250, 66, 235,.5)',
  'success' : 'rgb(111, 165, 111)',
  'danger' : 'rgb(235, 111, 127)',
};

export const dark = {
  'text': 'rgb(220, 221, 254)',
  'textInverted' : 'rgb(1, 2, 35)',
  'background': 'rgb(15, 15, 20)',
  'borderLight': 'rgb(62, 62, 92)',
  'primary': 'rgb(107, 6, 249)',
  'secondary': 'rgb(189, 148, 0)',
  'accent': 'rgb(224, 4, 206)',
  'formControl' : 'rgb(33, 33, 42)',
  'formControlFocused' : 'rgba(189, 5, 174,.5)',
  'success' : 'rgb(52, 74, 52)',
  'danger' : 'rgb(142, 55, 67)',
}

//color inversions
light.textInverted = dark.text;
dark.textInverted = light.text;

export const Colors = { light, dark};

export type colorSchemas = 'dark' | 'light';
