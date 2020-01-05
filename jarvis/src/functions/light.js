import React, { useState, useEffect } from 'react'
import { HuePicker, SketchPicker as ColorPicker } from 'react-color'

import helpers from '../helpers/colorConverters'
import defaults from './defaults'


/*
 * ACTIONS
 *
 */
function LightColorAction(props) {
	const { device, stateKey, stateVal } = props;
	
	const [colorSpace, setColorSpace] = useState(stateVal);
	useEffect(() => setColorSpace(stateVal), [stateVal]);
	
	let colors, labels = {};
	if (stateKey === 'rgb' && colorSpace) {
		colors = colorSpace.split(',');
		labels = { Red: colors[0], Green: colors[1], Blue: colors[2] };
		
	}
	else if (stateKey === 'hsv' && colorSpace) {
		colors = colorSpace.split(',');
		labels = { Hue: colors[0], Saturation: colors[1], Brightness: colors[2] };
	}
	
	const Label = defaults.components.Label;
	let label = [];
	for (let key in labels) {
		label.push(<Label key={key} label={key + ' ' + labels[key]} br={true} />);
	}
	
	return label;
}


/*
 * COMPONENTS
 *
 */
function LightColorTemperatureComponent(props) {
	const Level = defaults.components.LevelComponent;
	return (
		<Level min={2000} max={6500} step={10} {...props} />
	);
}

function LightHueComponent(props) {
	const { device, stateKey, stateVal, title } = props;
	
	const onChangeComplete = (color, e) => {
		setHue(Math.round(color.hsl.h));
		device.setDeviceState(stateKey, Math.round(color.hsl.h)).catch(err => console.error(err));
	}
	
	const [hue, setHue] = useState(stateVal);
	useEffect(() => setHue(stateVal), [stateVal]);
	
	const Component = defaults.components.Component;
	const color = helpers.RgbToHex(helpers.HsvToRgb(hue));
	return (

<Component title={title || stateKey }>
	<HuePicker
		color={color}
		width={'100%'}
		onChangeComplete={onChangeComplete}
		/>
		
</Component>

	);
}

function LightColorComponent(props) {
	const { device, stateKey, stateVal, title } = props;
	
	const onChangeComplete = (color, e) => {
		color = color[stateKey];
		
		// RGB
		if (stateKey === 'rgb') {
			color = [color.r, color.g, color.b].join(',');
		}
		// HSV
		else if (stateKey === 'hsv') {
			color = [color.h, color.s, color.v].join(',');
		}
		
		console.log(color);
		device.setDeviceState(stateKey, color).catch(err => console.error(err));
	};
	
	let initialColor = stateVal || '#ffffff';
	
	// RGB
	if (stateKey === 'rgb') {
		initialColor = helpers.RgbToHex(initialColor);
	}
	// HSV
	else if (stateKey === 'hsv') {
		initialColor = helpers.RgbToHex(helpers.HsvToRgb(initialColor));
	}
	
	const [colorSpace, setColorSpace] = useState(initialColor);
	useEffect(() => {
		// RGB
		if (stateKey === 'rgb') {
			setColorSpace(helpers.RgbToHex(stateVal));
		}
		// HSV
		else if (stateKey === 'hsv') {
			setColorSpace(helpers.RgbToHex(helpers.HsvToRgb(stateVal)));
		}
		// HEX
		else if (stateKey === 'hex') {
			setColorSpace(stateVal);
		}
	}, [stateVal]);
	
	const Component = defaults.components.Component;
	return (

<Component title={title || stateKey }>
	<ColorPicker
		color={colorSpace}
		width={'100%'}
		onChangeComplete={onChangeComplete}
		/>
		
</Component>

	);
}



export default {
	configurations: {
		power: {
			icon: {
				_widget: 'light-switch',
				'true': 'lightbulb-on',
				'false': 'lightbulb-off-outline'
			},
		},
		level: {
			value: (val) => val > 0 && val <= 1 ? val * 100 : val,
			unit: (value) => value !== 'off' ? ' %' : null,
			icon: {
				_widget: 'brightness-percent',
				'default': 'lightbulb-on',
				'0': 'lightbulb-off-outline'
			},
			state: {
				'0': 'off'
			},
		},
		colorTemperature: {
			icon: {
				_widget: 'thermometer',
			},
			unit: ' °K'
		},
		hue: {
			icon: {
				_widget: 'palette',
			},
			unit: ' °'
		},
		rgb: {
			icon: {
				_widget: 'palette',
			},
		},
		hsv: {
			icon: {
				_widget: 'palette',
			},
		},
		hex: {
			icon: {
				_widget: 'palette',
			},
		}
	},
	components: {
		level: defaults.components.LevelComponent,
		colorTemperature: LightColorTemperatureComponent,
		rgb: LightColorComponent,
		hsv: LightColorComponent,
		hex: LightColorComponent,
		hue: LightHueComponent
	},
	actions: {
		power: defaults.actions.PowerAction,
		rgb: LightColorAction,
		hsv: LightColorAction,
		hex: LightColorAction
	},
	styles: {
		_any: {
			//icon: {},
			state: {
				'0': {
					'color': '#999'
				}
			}
		}
	}
}