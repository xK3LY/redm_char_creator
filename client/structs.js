Number.prototype.pad = Number.prototype.pad || function (base) {
	var nr = this, len = (String(base).length - String(nr).length) + 1;
	return len > 0 ? new Array(len).join('0') + nr : nr;
};

exports('_UI_FEED_POST_OBJECTIVE', (duration, text) => {
	const struct1 = new DataView(new ArrayBuffer(96));
	struct1.setInt32(0 * 8, duration, true);

	const struct2 = new DataView(new ArrayBuffer(64));
	struct2.setBigInt64(1 * 8, BigInt(CreateVarString(10, "LITERAL_STRING", text)), true);

	Citizen.invokeNative("0xCEDBF17EFCC0E4A4", struct1, struct2, 1, 1);
});

exports("_EVENT_MANAGER_PEEK_EVENT", (eventChannel) => {
	let retStruct = new DataView(new ArrayBuffer(64));

	Citizen.invokeNative("0x90237103F27F7937", eventChannel, retStruct);

	return {
		eventType: retStruct.getInt32(8 * 0, true), // eventHash
		intParam: retStruct.getInt32(8 * 1, true), // entryIndex
		hashParam: retStruct.getInt32(8 * 2, true), // entryHash
		datastoreParam: retStruct.getInt32(8 * 3, true)
	};
});

exports("_GENERATE_SWATCH_TEXTURE_DIRECTLY", (slot, img, dict, component) => {
	if (typeof (component) !== "number") component = GetHashKey(component);

	let struct = new DataView(new ArrayBuffer(128));
	struct.setBigInt64(8 * 2, BigInt(CreateVarString(10, "LITERAL_STRING", dict)), true);
	struct.setBigInt64(8 * 1, BigInt(CreateVarString(10, "LITERAL_STRING", img)), true);
	struct.setBigInt64(8 * 3, BigInt(component), true);
	struct.setBigInt64(8 * 4, BigInt(component), true);
	struct.setBigInt64(8 * 5, BigInt(component), true);

	Citizen.invokeNative("0x646ED1A1D28487DF", slot, struct);
});

exports("TASK_MOVE_NETWORK_ADVANCED_BY_NAME_WITH_INIT_PARAMS", (ped, pos, rot, def, clipset, unk5, unk6, unk7, unk8, unk9) => {
	if (typeof (clipset) !== "number") clipset = GetHashKey(clipset);

	let struct = new DataView(new ArrayBuffer(512));
	struct.setBigInt64(8 * 0, BigInt(clipset), true);
	struct.setBigInt64(8 * 1, BigInt(clipset), true);
	struct.setBigInt64(8 * 4, BigInt(CreateVarString(10, "LITERAL_STRING", unk5)), true);
	struct.setFloat64(8 * 5, unk6, true);
	struct.setBigInt64(8 * 7, BigInt(CreateVarString(10, "LITERAL_STRING", unk7)), true);
	struct.setFloat64(8 * 8, unk8, true);
	struct.setBigInt64(8 * 30, BigInt(CreateVarString(10, "LITERAL_STRING", unk9)), true);

	Citizen.invokeNative("0x7B6A04F98BBAFB2C", ped, def, struct, pos, rot, 2, 0.0, 0, 0, 2, 0);
});

/* [ Databinding ] */
exports("SetupDatabinding", (ped, character, presets, swatches) => {
	let uiElements = {};

	var id = 0;
	for (id = 0; id < 286; id++) {
		uiElements = DatabindingCreateFromIndex(uiElements, id, ped, character, presets, swatches);
	}

	return uiElements;
});

DatabindingCreateFromIndex = function (uiElements, id, ped, character, presets, swatches) {
	let swatch;

	let gender = "F";
	if (IsPedMale(ped)) {
		gender = "M";
	}

	switch (id) {
		case 0:
			uiElements[id] = DatabindingAddDataContainerFromPath("", "CharacterCreationRoot");
			break;
		case 1:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "header");
			break;
		case 2:
			uiElements[id] = DatabindingAddDataHash(uiElements[1], "label", 1361833557);
			break;
		case 3:
			uiElements[id] = DatabindingAddDataHash(uiElements[1], "sublabel", 1574464441);
			break;
		case 4:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "footer");
			break;
		case 5:
			uiElements[id] = DatabindingAddDataString(uiElements[4], "label", "");
			break;
		case 6:
			uiElements[id] = DatabindingAddDataHash(uiElements[4], "color", GetHashKey("COLOR_WHITE"));
			break;
		case 7:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "DetailsImage");
			break;
		case 8:
			uiElements[id] = DatabindingAddDataBool(uiElements[7], "Enabled", false);
			break;
		case 9:
			uiElements[id] = DatabindingAddDataHash(uiElements[7], "Texture", 0);
			break;
		case 12:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "save_game_name");
			break;
		case 13:
			uiElements[id] = DatabindingAddDataString(uiElements[12], "value", GetChar(character, "root/name", GetPlayerName(PlayerId())));
			break;
		case 14:
			uiElements[id] = DatabindingAddDataBool(uiElements[12], "enabled", false);
			break;
		case 29:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "randomize");
			break;
		case 30:
			uiElements[id] = DatabindingAddDataBool(uiElements[29], "visible", false);
			break;
		case 41:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "age_option");
			break;
		case 42:
			uiElements[id] = DatabindingAddDataBool(uiElements[41], "visible", true);
			break;
		case 43:
			uiElements[id] = DatabindingAddDataBool(uiElements[41], "enabled", true);
			break;
		case 44:
			uiElements[id] = DatabindingAddDataInt(uiElements[41], "value", 18);
			break;
		case 45:
			uiElements[id] = DatabindingAddDataInt(uiElements[41], "minimum", 18);
			break;
		case 46:
			uiElements[id] = DatabindingAddDataInt(uiElements[41], "maximum", 60);
			break;
		case 15:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "appearance_option");
			break;
		case 16:
			uiElements[id] = DatabindingAddDataBool(uiElements[15], "enabled", true);
			break;
		case 17:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "hair_colors_match");
			break;
		case 18:
			uiElements[id] = DatabindingAddDataBool(uiElements[17], "value", false);
			break;
		case 19:
			uiElements[id] = DatabindingAddDataBool(uiElements[17], "enabled", true);
			break;
		case 20:
			uiElements[id] = DatabindingAddDataBool(uiElements[0], "zoom_enabled", true);
			break;
		case 21:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "whistle_option");
			break;
		case 22:
			uiElements[id] = DatabindingAddDataBool(uiElements[21], "enabled", true);
			break;
		case 23:
			uiElements[id] = DatabindingAddDataBool(uiElements[21], "visible", true);
			break;
		case 24:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "attributes_option");
			break;
		case 25:
			uiElements[id] = DatabindingAddDataBool(uiElements[24], "enabled", false);
			break;
		case 26:
			uiElements[id] = DatabindingAddDataBool(uiElements[24], "visible", false);
			break;
		case 27:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "confirm_option");
			break;
		case 28:
			uiElements[id] = DatabindingAddDataBool(uiElements[27], "enabled", true);
			break;
		case 35:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "skin_tone");
			break;
		case 36:
			uiElements[id] = DatabindingAddDataBool(uiElements[35], "visible", true);
			break;
		case 37:
			uiElements[id] = Citizen.invokeNative("0xD48993A61938C64D", uiElements[35], "options");
			break;
		case 38:
			uiElements[id] = DatabindingAddDataInt(uiElements[35], "value", GetChar(character, "root/tone", 0));
			break;
		case 39:
			uiElements[id] = DatabindingAddDataString(uiElements[35], "texture_dictionary", "SwatchTxd");
			break;
		case 40:
			swatch = GetSwatch("skin_tone", swatches);
			const tone = GetChar(character, "root/tone", 0);

			uiElements[id] = DatabindingAddDataString(uiElements[35], "texture", `slot${(swatch.offset + tone).pad(10)}`);
			break;
		case 110:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "appearance_page_color_swatch");
			break;
		case 111:
			uiElements[id] = DatabindingAddDataBool(uiElements[110], "Visible", false);
			break;
		case 112:
			uiElements[id] = DatabindingAddDataString(uiElements[110], "Title", " ");
			break;
		case 113:
			uiElements[id] = DatabindingAddDataInt(uiElements[110], "FocusedIndex", 0);
			break;
		case 114:
			uiElements[id] = DatabindingAddDataContainer(uiElements[110], "Items");
			break;
		case 115:
			uiElements[id] = DatabindingAddUiItemList(uiElements[110], "ItemList");
			break;
		case 47:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "body_build");
			break;
		case 48:
			uiElements[id] = DatabindingAddDataBool(uiElements[47], "visible", true);
			break;
		case 49:
			uiElements[id] = DatabindingAddHashArray(uiElements[47], "options");

			DatabindingClearBindingArray(uiElements[id]);
			for (let index in presets["body_build"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`MPBODY_BUILD_${IsPedMale(ped) ? "MALE" : "FEMALE"}_${index}`), -1);
			}

			break;
		case 50:
			uiElements[id] = DatabindingAddDataInt(uiElements[47], "value", GetChar(character, "root/build", 0));
			break;
		case 106:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "lifestyle");
			break;
		case 107:
			uiElements[id] = DatabindingAddDataBool(uiElements[106], "visible", true);
			break;
		case 108:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "makeup");
			break;
		case 109:
			uiElements[id] = DatabindingAddDataBool(uiElements[108], "visible", !IsPedMale(ped) ? true : false);
			break;
		case 10:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "head_main");
			break;
		case 116:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "grid");
			break;
		case 118:
			uiElements[id] = DatabindingAddDataBool(uiElements[116], "grid_xy_visible", false);
			break;
		case 117:
			uiElements[id] = DatabindingAddDataBool(uiElements[116], "grid_x_visible", false);
			break;
		case 119:
			uiElements[id] = DatabindingAddDataString(uiElements[116], "leftLabel", " ");
			break;
		case 120:
			uiElements[id] = DatabindingAddDataString(uiElements[116], "rightLabel", " ");
			break;
		case 121:
			uiElements[id] = DatabindingAddDataString(uiElements[116], "topLabel", " ");
			break;
		case 122:
			uiElements[id] = DatabindingAddDataString(uiElements[116], "bottomLabel", " ");
			break;
		case 123:
			uiElements[id] = DatabindingAddDataFloat(uiElements[116], "XAxis", 0.0);
			break;
		case 124:
			uiElements[id] = DatabindingAddDataFloat(uiElements[116], "YAxis", 0.0);
			break;
		case 31:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "heritage");
			break;
		case 32:
			uiElements[id] = DatabindingAddDataBool(uiElements[31], "visible", true);
			break;
		case 33:
			uiElements[id] = DatabindingAddHashArray(uiElements[31], "options");

			DatabindingClearBindingArray(uiElements[id]);
			for (let index in presets["head"][gender.toLowerCase()]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_HEAD_PAGE_PRESET_${index.pad(10)}`), -1);
			}

			break;
		case 34:
			uiElements[id] = DatabindingAddDataInt(uiElements[31], "value", GetChar(character, "root/head", 0));
			break;
		case 125:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "head_width");
			break;
		case 126:
			uiElements[id] = DatabindingAddDataInt(uiElements[125], "value", false);
			break;
		case 127:
			uiElements[id] = DatabindingAddDataInt(uiElements[125], "minimum", -50);
			break;
		case 128:
			uiElements[id] = DatabindingAddDataInt(uiElements[125], "maximum", 50);
			break;
		case 129:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "brow_shape");
			break;
		case 130:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "pedexpress_brow_depth");
			break;
		case 131:
			uiElements[id] = DatabindingAddDataInt(uiElements[130], "value", false);
			break;
		case 132:
			uiElements[id] = DatabindingAddDataInt(uiElements[130], "minimum", -50);
			break;
		case 133:
			uiElements[id] = DatabindingAddDataInt(uiElements[130], "maximum", 50);
			break;
		case 134:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "ear_shape");
			break;
		case 135:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "ear_size");
			break;
		case 136:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "cheek_shape");
			break;
		case 137:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "pedexpress_cheeks_depth");
			break;
		case 138:
			uiElements[id] = DatabindingAddDataInt(uiElements[137], "value", false);
			break;
		case 139:
			uiElements[id] = DatabindingAddDataInt(uiElements[137], "minimum", -50);
			break;
		case 140:
			uiElements[id] = DatabindingAddDataInt(uiElements[137], "maximum", 50);
			break;
		case 151:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "mouth");
			break;
		case 152:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "mouth_position");
			break;
		case 153:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "upper_lip_shape");
			break;
		case 154:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "lower_lip_shape");
			break;
		case 155:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "pedexpress_lips_depth");
			break;
		case 156:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "nose_option");
			break;
		case 157:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "nose_shape");
			break;
		case 158:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "nose_tip");
			break;
		case 141:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "jaw_shape");
			break;
		case 142:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "pedexpress_jaw_depth");
			break;
		case 143:
			uiElements[id] = DatabindingAddDataInt(uiElements[142], "value", false);
			break;
		case 144:
			uiElements[id] = DatabindingAddDataInt(uiElements[142], "minimum", -50);
			break;
		case 145:
			uiElements[id] = DatabindingAddDataInt(uiElements[142], "maximum", 50);
			break;
		case 146:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "pedexpress_chin_shape");
			break;
		case 147:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "pedexpress_chin_depth");
			break;
		case 148:
			uiElements[id] = DatabindingAddDataInt(uiElements[147], "value", false);
			break;
		case 149:
			uiElements[id] = DatabindingAddDataInt(uiElements[147], "minimum", -50);
			break;
		case 150:
			uiElements[id] = DatabindingAddDataInt(uiElements[147], "maximum", 50);
			break;
		case 51:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "eye_color");
			break;
		case 52:
			uiElements[id] = DatabindingAddDataBool(uiElements[51], "visible", true);
			break;
		case 53:
			uiElements[id] = Citizen.invokeNative("0xD48993A61938C64D", uiElements[51], "options");
			break;
		case 54:
			uiElements[id] = DatabindingAddDataInt(uiElements[51], "value", GetChar(character, "eye_color", 0));
			break;
		case 55:
			uiElements[id] = DatabindingAddDataString(uiElements[51], "texture_dictionary", "SwatchTxd");
			break;
		case 56:
			swatch = GetSwatch("eye_color", swatches);
			const eyeColor = GetChar(character, "eye_color", 0);

			uiElements[id] = DatabindingAddDataString(uiElements[51], "texture", `slot${(swatch.offset + eyeColor).pad(10)}`);
			break;
		case 159:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "eye_redness");
			break;
		case 160:
			uiElements[id] = DatabindingAddDataInt(uiElements[159], "value", false);
			break;
		case 161:
			uiElements[id] = DatabindingAddDataInt(uiElements[159], "minimum", false);
			break;
		case 162:
			uiElements[id] = DatabindingAddDataInt(uiElements[159], "maximum", 50);
			break;
		case 163:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "eye_size");
			break;
		case 164:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "eye_depth");
			break;
		case 165:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "eye_position");
			break;
		case 91:
			uiElements[id] = DatabindingAddDataContainer(uiElements[10], "teeth");
			break;
		case 92:
			uiElements[id] = DatabindingAddDataBool(uiElements[91], "visible", true);
			break;
		case 93:
			uiElements[id] = DatabindingAddHashArray(uiElements[91], "options");

			DatabindingClearBindingArray(uiElements[id]);
			for (let index in presets["teeth"][gender.toLowerCase()]) {
				index = parseInt(index);

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CLOTHING_ITEM_${gender}_TEETH_${index.pad(100)}`), -1);
			}

			break;
		case 94:
			uiElements[id] = DatabindingAddDataInt(uiElements[91], "value", GetChar(character, "teeth", 0));
			break;
		case 61:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "eyes_and_brows");
			break;
		case 62:
			uiElements[id] = DatabindingAddDataBool(uiElements[61], "visible", true);
			break;
		case 63:
			uiElements[id] = DatabindingAddHashArray(uiElements[61], "options");

			DatabindingClearBindingArray(uiElements[id]);
			for (let index in presets["nose"]) {
				index = parseInt(index);

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`EXPRESSION_PRESET_EYES_${index.pad(10)}`), -1);
			}

			break;
		case 64:
			uiElements[id] = DatabindingAddDataInt(uiElements[61], "value", GetChar(character, "expressions/eyes", 0));
			break;
		case 65:
			uiElements[id] = DatabindingAddDataBool(uiElements[61], "customizable", false);
			break;
		case 66:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "nose");
			break;
		case 67:
			uiElements[id] = DatabindingAddDataBool(uiElements[66], "visible", true);
			break;
		case 68:
			uiElements[id] = DatabindingAddHashArray(uiElements[66], "options");

			DatabindingClearBindingArray(uiElements[id]);
			for (let index in presets["nose"]) {
				index = parseInt(index);

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`EXPRESSION_PRESET_NOSE_${index.pad(10)}`), -1);
			}

			break;
		case 69:
			uiElements[id] = DatabindingAddDataInt(uiElements[66], "value", GetChar(character, "expressions/nose", 0));
			break;
		case 70:
			uiElements[id] = DatabindingAddDataBool(uiElements[66], "customizable", false);
			break;
		case 71:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "mouth_and_lips");
			break;
		case 72:
			uiElements[id] = DatabindingAddDataBool(uiElements[71], "visible", true);
			break;
		case 73:
			uiElements[id] = DatabindingAddHashArray(uiElements[71], "options");

			DatabindingClearBindingArray(uiElements[id]);
			for (let index in presets["mouth"]) {
				index = parseInt(index);

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`EXPRESSION_PRESET_MOUTH_${index.pad(10)}`), -1);
			}

			break;
		case 74:
			uiElements[id] = DatabindingAddDataInt(uiElements[71], "value", GetChar(character, "expressions/mouth", 0));
			break;
		case 75:
			uiElements[id] = DatabindingAddDataBool(uiElements[71], "customizable", false);
			break;
		case 76:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "jaw_and_chin");
			break;
		case 77:
			uiElements[id] = DatabindingAddDataBool(uiElements[76], "visible", true);
			break;
		case 78:
			uiElements[id] = DatabindingAddHashArray(uiElements[76], "options");

			DatabindingClearBindingArray(uiElements[id]);
			for (let index in presets["jaw"]) {
				index = parseInt(index);

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`EXPRESSION_PRESET_JAW_${index.pad(10)}`), -1);
			}

			break;
		case 79:
			uiElements[id] = DatabindingAddDataInt(uiElements[76], "value", GetChar(character, "expressions/jaw", 0));
			break;
		case 80:
			uiElements[id] = DatabindingAddDataBool(uiElements[76], "customizable", false);
			break;
		case 81:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "ears");
			break;
		case 82:
			uiElements[id] = DatabindingAddDataBool(uiElements[81], "visible", true);
			break;
		case 83:
			uiElements[id] = DatabindingAddHashArray(uiElements[81], "options");

			DatabindingClearBindingArray(uiElements[id]);
			for (let index in presets["ears"]) {
				index = parseInt(index);

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`EXPRESSION_PRESET_EARS_${index.pad(10)}`), -1);
			}

			break;
		case 84:
			uiElements[id] = DatabindingAddDataInt(uiElements[81], "value", GetChar(character, "expressions/ears", 0));
			break;
		case 85:
			uiElements[id] = DatabindingAddDataBool(uiElements[81], "customizable", false);
			break;
		case 86:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "cheeks");
			break;
		case 87:
			uiElements[id] = DatabindingAddDataBool(uiElements[86], "visible", true);
			break;
		case 88:
			uiElements[id] = DatabindingAddHashArray(uiElements[86], "options");

			DatabindingClearBindingArray(uiElements[id]);
			for (let index in presets["cheeks"]) {
				index = parseInt(index);

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`EXPRESSION_PRESET_CHEEKS_${index.pad(10)}`), -1);
			}

			break;
		case 89:
			uiElements[id] = DatabindingAddDataInt(uiElements[86], "value", GetChar(character, "expressions/cheeks", 0));
			break;
		case 90:
			uiElements[id] = DatabindingAddDataBool(uiElements[86], "customizable", false);
			break;
		case 11:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "face_main");
			break;
		case 166:
			uiElements[id] = DatabindingAddDataBool(uiElements[11], "facial_hair_hidden", false);
			break;
		case 167:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "face_preset");
			break;
		case 168:
			uiElements[id] = DatabindingAddHashArray(uiElements[167], "options");
			break;
		case 169:
			uiElements[id] = DatabindingAddDataInt(uiElements[167], "value", false);
			break;
		case 170:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_mottling");
			break;
		case 171:
			uiElements[id] = DatabindingAddHashArray(uiElements[170], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["mottling"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_SKIN_MOTTLING_${index.pad(10)}`), -1);
			}

			break;
		case 172:
			uiElements[id] = DatabindingAddDataInt(uiElements[170], "value", GetChar(character, "overlays/mottling", 0));
			break;
		case 173:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_aging");
			break;
		case 174:
			uiElements[id] = DatabindingAddHashArray(uiElements[173], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["aging"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_AGING_${index.pad(10)}`), -1);
			}

			break;
		case 175:
			uiElements[id] = DatabindingAddDataInt(uiElements[173], "value", GetChar(character, "overlays/aging", 0));
			break;
		case 176:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_complexion");
			break;
		case 177:
			uiElements[id] = DatabindingAddHashArray(uiElements[176], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["complexion"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_COMPLEXION_${index.pad(10)}`), -1);
			}

			break;
		case 178:
			uiElements[id] = DatabindingAddDataInt(uiElements[176], "value", GetChar(character, "overlays/complexion", 0));
			break;
		case 179:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_complexion_2");
			break;
		case 180:
			uiElements[id] = DatabindingAddHashArray(uiElements[179], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["complexion_2"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_COMPLEXION_${index.pad(10)}`), -1);
			}

			break;
		case 181:
			uiElements[id] = DatabindingAddDataInt(uiElements[179], "value", GetChar(character, "overlays/complexion_2", 0));
			break;
		case 238:
			uiElements[id] = DatabindingAddDataBool(uiElements[179], "fine_tune_enabled", false);
			break;
		case 182:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_freckles");
			break;
		case 183:
			uiElements[id] = DatabindingAddHashArray(uiElements[182], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["freckles"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_FRECKLES_${index.pad(10)}`), -1);
			}

			break;
		case 184:
			uiElements[id] = DatabindingAddDataInt(uiElements[182], "value", GetChar(character, "overlays/freckles", 0));
			break;
		case 240:
			uiElements[id] = DatabindingAddDataBool(uiElements[182], "fine_tune_enabled", false);
			break;
		case 185:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_moles");
			break;
		case 186:
			uiElements[id] = DatabindingAddHashArray(uiElements[185], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["moles"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_MOLES_${index.pad(10)}`), -1);
			}

			break;
		case 187:
			uiElements[id] = DatabindingAddDataInt(uiElements[185], "value", GetChar(character, "overlays/moles", 0));
			break;
		case 241:
			uiElements[id] = DatabindingAddDataBool(uiElements[185], "fine_tune_enabled", false);
			break;
		case 188:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_spots");
			break;
		case 189:
			uiElements[id] = DatabindingAddHashArray(uiElements[188], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["spots"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_SPOTS_${index.pad(10)}`), -1);
			}

			break;
		case 190:
			uiElements[id] = DatabindingAddDataInt(uiElements[188], "value", GetChar(character, "overlays/spots", 0));
			break;
		case 242:
			uiElements[id] = DatabindingAddDataBool(uiElements[188], "fine_tune_enabled", false);
			break;
		case 191:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_scar");
			break;
		case 192:
			uiElements[id] = DatabindingAddHashArray(uiElements[191], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["scar"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_SCAR_${index.pad(10)}`), -1);
			}

			break;
		case 193:
			uiElements[id] = DatabindingAddDataInt(uiElements[191], "value", GetChar(character, "overlays/scar", 0));
			break;
		case 239:
			uiElements[id] = DatabindingAddDataBool(uiElements[191], "fine_tune_enabled", false);
			break;
		case 194:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_spots_2");
			break;
		case 195:
			uiElements[id] = DatabindingAddHashArray(uiElements[194], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["spots_2"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_SPOTS_${index.pad(10)}`), -1);
			}

			break;
		case 196:
			uiElements[id] = DatabindingAddDataInt(uiElements[194], "value", GetChar(character, "overlays/spots_2", 0));
			break;
		case 197:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_foundation");
			break;
		case 198:
			uiElements[id] = DatabindingAddHashArray(uiElements[197], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["foundation"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_FOUNDATION_${index.pad(10)}`), -1);
			}

			break;
		case 199:
			uiElements[id] = DatabindingAddDataInt(uiElements[197], "value", GetChar(character, "overlays/foundation", 0));
			break;
		case 243:
			uiElements[id] = DatabindingAddDataBool(uiElements[197], "fine_tune_enabled", false);
			break;
		case 200:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_blusher");
			break;
		case 201:
			uiElements[id] = DatabindingAddHashArray(uiElements[200], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["blusher"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_BLUSHER_${index.pad(10)}`), -1);
			}

			break;
		case 202:
			uiElements[id] = DatabindingAddDataInt(uiElements[200], "value", GetChar(character, "overlays/blusher", 0));
			break;
		case 244:
			uiElements[id] = DatabindingAddDataBool(uiElements[200], "fine_tune_enabled", false);
			break;
		case 206:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_eyeshadow");
			break;
		case 207:
			uiElements[id] = DatabindingAddHashArray(uiElements[206], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["eyeshadow"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_EYESHADOW_${index.pad(10)}`), -1);
			}

			break;
		case 208:
			uiElements[id] = DatabindingAddDataInt(uiElements[206], "value", GetChar(character, "overlays/eyeshadow", 0));
			break;
		case 245:
			uiElements[id] = DatabindingAddDataBool(uiElements[206], "fine_tune_enabled", false);
			break;
		case 224:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_eyeshadow_color");
			break;
		case 225:
			uiElements[id] = Citizen.invokeNative("0xD48993A61938C64D", uiElements[224], "options");
			break;
		case 226:
			uiElements[id] = DatabindingAddDataInt(uiElements[224], "value", GetChar(character, "overlays/eyeshadow_color", 0));
			break;
		case 227:
			uiElements[id] = DatabindingAddDataString(uiElements[224], "texture_dictionary", "SwatchTxd");
			break;
		case 228:
			swatch = GetSwatch("eyeshadow_color", swatches);
			const eyeShadowColor = GetChar(character, "overlays/eyeshadow_color", 0);

			uiElements[id] = DatabindingAddDataString(uiElements[224], "texture", `slot${(swatch.offset + eyeShadowColor).pad(10)}`);
			break;
		case 229:
			uiElements[id] = DatabindingAddDataBool(uiElements[224], "visible", true);
			break;
		case 230:
			uiElements[id] = DatabindingAddDataBool(uiElements[224], "enabled", true);
			break;
		case 203:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_eyeliner");
			break;
		case 204:
			uiElements[id] = DatabindingAddHashArray(uiElements[203], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["eyeliner"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_EYELINER_${index.pad(10)}`), -1);
			}

			break;
		case 205:
			uiElements[id] = DatabindingAddDataInt(uiElements[203], "value", GetChar(character, "overlays/eyeliner", 0));
			break;
		case 246:
			uiElements[id] = DatabindingAddDataBool(uiElements[203], "fine_tune_enabled", false);
			break;
		case 209:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_lipstick");
			break;
		case 210:
			uiElements[id] = DatabindingAddHashArray(uiElements[209], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CHAR_CREATOR_LAYER_NONE"), -1);
			for (let index in presets["lipstick"]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_LIPSTICK_${index.pad(10)}`), -1);
			}

			break;
		case 211:
			uiElements[id] = DatabindingAddDataInt(uiElements[209], "value", GetChar(character, "overlays/lipstick", 0));
			break;
		case 247:
			uiElements[id] = DatabindingAddDataBool(uiElements[209], "fine_tune_enabled", false);
			break;
		case 231:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_lipstick_color");
			break;
		case 232:
			uiElements[id] = Citizen.invokeNative("0xD48993A61938C64D", uiElements[231], "options");
			break;
		case 233:
			uiElements[id] = DatabindingAddDataInt(uiElements[231], "value", GetChar(character, "overlays/lipstick_color", 0));
			break;
		case 234:
			uiElements[id] = DatabindingAddDataString(uiElements[231], "texture_dictionary", "SwatchTxd");
			break;
		case 235:
			swatch = GetSwatch("lipstick_color", swatches);
			const lipstickColor = GetChar(character, "overlays/lipstick_color", 0);

			uiElements[id] = DatabindingAddDataString(uiElements[231], "texture", `slot${(swatch.offset + lipstickColor).pad(10)}`);
			break;
		case 236:
			uiElements[id] = DatabindingAddDataBool(uiElements[231], "visible", true);
			break;
		case 237:
			uiElements[id] = DatabindingAddDataBool(uiElements[231], "enabled", true);
			break;
		case 212:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "skin_scabs");
			break;
		case 213:
			uiElements[id] = DatabindingAddHashArray(uiElements[212], "options");
			break;
		case 214:
			uiElements[id] = DatabindingAddDataInt(uiElements[212], "value", false);
			break;
		case 57:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "eyebrows");
			break;
		case 58:
			uiElements[id] = DatabindingAddDataBool(uiElements[57], "visible", true);
			break;
		case 59:
			uiElements[id] = DatabindingAddHashArray(uiElements[57], "options");

			DatabindingClearBindingArray(uiElements[id]);
			for (let index in presets["eyebrows"][gender.toLowerCase()]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`CHAR_CREATOR_EYEBROWS_${index.pad(10)}`), -1);
			}

			break;
		case 60:
			uiElements[id] = DatabindingAddDataInt(uiElements[57], "value", false);
			break;
		case 215:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "grime");
			break;
		case 216:
			uiElements[id] = DatabindingAddHashArray(uiElements[215], "options");
			break;
		case 217:
			uiElements[id] = DatabindingAddDataInt(uiElements[215], "value", false);
			break;
		case 218:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "grime_wear");
			break;
		case 219:
			uiElements[id] = DatabindingAddHashArray(uiElements[218], "options");
			break;
		case 220:
			uiElements[id] = DatabindingAddDataInt(uiElements[218], "value", false);
			break;
		case 221:
			uiElements[id] = DatabindingAddDataContainer(uiElements[11], "face_paint");
			break;
		case 222:
			uiElements[id] = DatabindingAddHashArray(uiElements[221], "options");
			break;
		case 223:
			uiElements[id] = DatabindingAddDataInt(uiElements[221], "value", false);
			break;
		case 95:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "hair_main");
			break;
		case 96:
			uiElements[id] = DatabindingAddDataBool(uiElements[95], "visible", true);
			break;
		case 97:
			uiElements[id] = DatabindingAddDataContainer(uiElements[95], "hair_style");
			break;
		case 98:
			uiElements[id] = DatabindingAddHashArray(uiElements[97], "options");
			DatabindingClearBindingArray(uiElements[id]);

			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CLOTHING_ITEM_HAIR_NONE"), -1);
			for (let index in presets["hair"][gender.toLowerCase()]) {
				index = parseInt(index) + 1;

				Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`BARBER_STYLE_${gender}_HAIR_${index.pad(100)}_PAGE`), -1);
			}

			break;
		case 99:
			uiElements[id] = DatabindingAddDataInt(uiElements[97], "value", GetChar(character, "hairs/hair/style", 0, true));
			break;
		case 100:
			uiElements[id] = DatabindingAddDataContainer(uiElements[95], "hair_color");
			break;
		case 101:
			uiElements[id] = DatabindingAddDataBool(uiElements[100], "enabled", true);
			break;
		case 102:
			uiElements[id] = Citizen.invokeNative("0xD48993A61938C64D", uiElements[100], "options");
			break;
		case 103:
			uiElements[id] = DatabindingAddDataInt(uiElements[100], "value", GetChar(character, "hairs/hair/color", 0));
			break;
		case 104:
			uiElements[id] = DatabindingAddDataString(uiElements[100], "texture_dictionary", "SwatchTxd");
			break;
		case 105:
			swatch = GetSwatch("hair_color", swatches);
			const hairColor = GetChar(character, "hairs/hair/color", 0);

			uiElements[id] = DatabindingAddDataString(uiElements[100], "texture", `slot${(swatch.offset + hairColor).pad(10)}`);

			break;
		case 248:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "beard_main");

			let beardStubble = DatabindingAddDataContainer(uiElements[id], "beard_stubble");
			DatabindingAddDataBool(beardStubble, "visible", false);

			break;
		case 249:
			uiElements[id] = DatabindingAddDataBool(uiElements[248], "visible", true);
			break;
		case 250:
			uiElements[id] = DatabindingAddDataContainer(uiElements[248], "beard_style");
			break;
		case 251:
			uiElements[id] = DatabindingAddHashArray(uiElements[250], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey("CLOTHING_ITEM_BEARD_NONE"), -1);

			if (gender === "M") {
				for (let index in presets["beard"]) {
					index = parseInt(index) + 1;

					Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[id], GetHashKey(`BARBER_STYLE_${gender}_BEARD_${index.pad(100)}_PAGE`), -1);
				}
			}

			break;
		case 252:
			uiElements[id] = DatabindingAddDataInt(uiElements[250], "value", GetChar(character, "hairs/beard/style", 0, true));
			break;
		case 253:
			uiElements[id] = DatabindingAddDataContainer(uiElements[248], "beard_color");
			break;
		case 254:
			uiElements[id] = DatabindingAddDataHash(uiElements[253], "SelectedOption", GetHashKey("COLOR_BLUELIGHT"));
			break;
		case 255:
			uiElements[id] = DatabindingAddDataBool(uiElements[253], "enabled", true);
			break;
		case 256:
			uiElements[id] = Citizen.invokeNative("0xD48993A61938C64D", uiElements[253], "options");
			break;
		case 257:
			uiElements[id] = DatabindingAddDataInt(uiElements[253], "value", GetChar(character, "hairs/beard/color", 0));
			break;
		case 258:
			uiElements[id] = DatabindingAddDataString(uiElements[253], "texture_dictionary", "SwatchTxd");
			break;
		case 259:
			swatch = GetSwatch("beard_color", swatches);
			const beardColor = GetChar(character, "hairs/beard/color", 0);

			uiElements[id] = DatabindingAddDataString(uiElements[253], "texture", `slot${(swatch.offset + beardColor).pad(10)}`);
			break;
		case 260:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "whistle_style");
			break;
		case 262:
			uiElements[id] = DatabindingAddHashArray(uiElements[260], "options");

			DatabindingClearBindingArray(uiElements[id]);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[262], 1408672400, -1);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[262], 1181091695, -1);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[262], -1920395852, -1);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[262], -1447080416, -1);
			Citizen.invokeNative("0x7FC60C94C83C5CD7", uiElements[262], 457257254, -1);
			break;
		case 261:
			uiElements[id] = DatabindingAddDataInt(uiElements[260], "value", GetChar(character, "whistle/shape", 0, true));
			break;
		case 263:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "whistle_pitch");
			break;
		case 264:

			uiElements[id] = DatabindingAddDataInt(uiElements[263], "value", GetChar(character, "whistle/pitch", 0, true) ? parseInt(GetChar(character, "whistle/pitch", 0, true) * 100) : 50);
			break;
		case 265:
			uiElements[id] = DatabindingAddDataInt(uiElements[263], "minimum", false);
			break;
		case 266:
			uiElements[id] = DatabindingAddDataInt(uiElements[263], "maximum", 100);
			break;
		case 267:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "whistle_clarity");
			break;
		case 268:
			uiElements[id] = DatabindingAddDataInt(uiElements[267], "value", GetChar(character, "whistle/clarity", 0, true) ? parseInt(GetChar(character, "whistle/clarity", 0, true) * 100) : 50);
			break;
		case 269:
			uiElements[id] = DatabindingAddDataInt(uiElements[267], "minimum", false);
			break;
		case 270:
			uiElements[id] = DatabindingAddDataInt(uiElements[267], "maximum", 100);
			break;
		case 271:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "health_attribute");
			break;
		case 272:
			uiElements[id] = DatabindingAddDataInt(uiElements[271], "value", false);
			break;
		case 273:
			uiElements[id] = DatabindingAddDataInt(uiElements[271], "minimum", false);
			break;
		case 274:
			uiElements[id] = DatabindingAddDataInt(uiElements[271], "maximum", 10);
			break;
		case 275:
			uiElements[id] = DatabindingAddDataInt(uiElements[271], "total_tanks", 10);
			break;
		case 276:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "stamina_attribute");
			break;
		case 277:
			uiElements[id] = DatabindingAddDataInt(uiElements[276], "value", false);
			break;
		case 278:
			uiElements[id] = DatabindingAddDataInt(uiElements[276], "minimum", false);
			break;
		case 279:
			uiElements[id] = DatabindingAddDataInt(uiElements[276], "maximum", 10);
			break;
		case 280:
			uiElements[id] = DatabindingAddDataInt(uiElements[276], "total_tanks", 10);
			break;
		case 281:
			uiElements[id] = DatabindingAddDataContainer(uiElements[0], "deadeye_attribute");
			break;
		case 282:
			uiElements[id] = DatabindingAddDataInt(uiElements[281], "value", false);
			break;
		case 283:
			uiElements[id] = DatabindingAddDataInt(uiElements[281], "minimum", false);
			break;
		case 284:
			uiElements[id] = DatabindingAddDataInt(uiElements[281], "maximum", 10);
			break;
		case 285:
			uiElements[id] = DatabindingAddDataInt(uiElements[281], "total_tanks", 10);
			break;

		default: break;
	}

	return uiElements;
};

GetSwatch = function (name, swatches) {
	return swatches[name];
};

GetChar = function (char, str, def, noInterp) {
	const tree = str.split("/");

	let lastEntry;
	for (let entry of tree) {
		if (!lastEntry) lastEntry = char;

		lastEntry = lastEntry[entry];
	}

	if (typeof (lastEntry) === "number" && !noInterp) {
		return lastEntry - 1;
	}

	return lastEntry || def;
};