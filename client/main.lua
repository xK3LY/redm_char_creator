Character = {}
Storage = {}

RegisterCommand('creator', function()
	Citizen.CreateThread(function ()
		OpenCharCreator(function(character)
			Character = character

			print('creator:', json.encode(character))
		end, function()
			ApplyCharacter(PlayerPedId(), Character)
		end, Character)
	end)
end, true)

OpenCharCreator = function(onConfirm, onCancel, character, ped)
	if not ped then ped = PlayerPedId() end

	local cam = CreateCamera(`DEFAULT_SCRIPTED_CAMERA`, true)
	local view = SetCameraView(cam, "FRONT_FULL_BODY", 0, ped)
	local creator = InitCreator(ped, character)
	local dict, anim

	creator.addEventHandler(-1203660660, function(data) -- ui button
		if (data["hashParam"] == `MPCC_UI_SELECT_EVENT_CANCEL_EDIT`) then
			if onCancel then
				onCancel(creator.getCharacter())
			end

			creator.close()
		elseif (data["hashParam"] == `MPCC_UI_SELECT_EVENT_CONFIRM_EDIT`) then	
			if onConfirm then
				onConfirm(creator.getCharacter())
			end

			creator.close()
		elseif (data["hashParam"] == -2037788474) then
			Citizen.CreateThread(function()
				while not IsTaskMoveNetworkReadyForTransition(ped) do
					Citizen.Wait(0)
				end

				local left = IsControlPressed(2, `INPUT_GAME_MENU_TAB_LEFT`)
				local right = IsControlPressed(2, `INPUT_GAME_MENU_TAB_RIGHT`)

				if left or right then
					local state = GetTaskMoveNetworkState(ped)
					local trans

					if (state == "Still_Idle") then
						trans = "Look_Left_Idle"

						if left then
							trans = "Look_Right_Idle"
						end
					end

					RequestTaskMoveNetworkStateTransition(ped, trans)
					while IsControlPressed(2, `INPUT_GAME_MENU_TAB_LEFT`) or IsControlPressed(2, `INPUT_GAME_MENU_TAB_RIGHT`) do
						Citizen.Wait(0)
					end

					if (state == "Still_Idle") then
						while not IsTaskMoveNetworkReadyForTransition(ped) do
							Citizen.Wait(0)
						end

						SetTaskMoveNetworkSignalFloat(ped, "CURRENT_HEADING", 0.5)
						RequestTaskMoveNetworkStateTransition(ped, "Still_Idle")
					end
				end
			end)	

		elseif (data["hashParam"] == 348032960) then -- sync hair
			local name, hashParam

			if creator.getFocused(`MPCC_UI_FOCUS_ITEM_HAIR_STYLE`) or creator.getFocused(-559666029) then
				name, hashParam = "beard_color", 1841403670
			elseif creator.getFocused(-1595605714) or creator.getFocused(1841403670) then
				name, hashParam = "hair_color", -559666029
			end

			if name then
				local swatch = Config.Swatches[name]

				if swatch then
					creator.writeString(swatch.c_txd, ("slot%02d"):format(swatch.offset + creator.readInt(113, true)))
					creator.writeInt(swatch.c_value, creator.readInt(113, true))

					creator.triggerEvent(-1151569080, { hashParam = hashParam, force = true })
				end
			end
		elseif (data["hashParam"] == `MPCC_UI_PLAY_WHISTLE_SOUND`) then
			TaskWhistleAnim(ped, 869278708, `UNSPECIFIED`)
		end
	end)

	creator.addEventHandler(-1151569080, function(data) --// ui item data changed
		local uiItem = Config.UIItems[creator.getFocused()]
		if data["force"] then
			uiItem = Config.UIItems[data["hashParam"]]
		end

		if uiItem then
			creator.eventsHandling(false)

			if (uiItem["category"] == "root") then
				local toneChanged = false

				if creator.getFocused("MPCC_UI_FOCUS_ITEM_SKIN_TONE") then
					creator.set("root/tone", creator.readInt(38))

					toneChanged = true
				end

				if creator.getFocused("MPCC_UI_FOCUS_ITEM_HEAD_PRESET_OPTION") or toneChanged then
					local head = GetComponentFromPreset(ped, "head", creator.readInt(34))

					if head then
						SetPedComponentEnabled(ped, head:format(creator.readInt(38)))
						SetPedOverlays(ped, creator.get("overlays", {}), creator.readInt(38))

						creator.set("root/head", creator.readInt(34))
					end
				end
			
				if creator.getFocused("MPCC_UI_FOCUS_ITEM_BODY_BUILD_OPTION") or toneChanged then
					local build = GetComponentFromPreset(ped, "body_build", creator.readInt(50))

					if build then
						SetPedComponentEnabled(ped, ("CLOTHING_ITEM_%s_BODIES_LOWER_%03d_V_%03d"):format(creator.getGender(), creator.readInt(50), creator.readInt(38)))
						SetPedComponentEnabled(ped, ("CLOTHING_ITEM_%s_BODIES_UPPER_%03d_V_%03d"):format(creator.getGender(), creator.readInt(50), creator.readInt(38)))	
						SetPedBodyComponent(ped, build)

						creator.set("root/build", creator.readInt(50))
					end
				end

				RefreshPed(ped)
			elseif (uiItem["category"] == "hairs") then		
				local hairColorChanged = false
				local beardColorChanged = false

				if creator.getFocused(-559666029) or data["force"] then
					creator.set("hairs/hair/color", creator.readInt(103))

					hairColorChanged = true
				end

				if creator.getFocused(`MPCC_UI_FOCUS_ITEM_HAIR_STYLE`) or hairColorChanged then
					if not (creator.readInt(99, true) == 0) then
						local palette = Config.Palettes["hairs"][creator.readInt(103)]

						if palette then
							local hair = GetComponentFromPreset(ped, "hair", creator.readInt(99, true)):format(palette)

							if hair then
								SetPedComponentEnabled(ped, hair)

								creator.set("hairs/hair/style", creator.readInt(99, true))
							end
						end
					else
						SetPedComponentDisabled(ped, 0x864B03AE)

						creator.set("hairs/hair/style", 0)
					end
				end
				
				if creator.getFocused(1841403670) or data["force"] then	
					creator.set("hairs/beard/color", creator.readInt(257))

					beardColorChanged = true
				end

				if creator.getFocused(-1595605714) or beardColorChanged then
					if not (creator.readInt(252, true) == 0) then
						local palette = Config.Palettes["hairs"][creator.readInt(257)]

						if palette then
							local hair = GetComponentFromPreset(ped, "beard", creator.readInt(252, true)):format(palette)

							if hair then
								SetPedComponentEnabled(ped, hair)

								creator.set("hairs/beard/style", creator.readInt(252, true))
							end
						end
					else
						SetPedComponentDisabled(ped, 0xF8016BCA)

						creator.set("hairs/beard/style", 0)
					end
				end

				RefreshPed(ped)
			elseif (uiItem["category"] == "expressions") then
				local name, value

				if creator.getFocused(`MPCC_UI_FOCUS_ITEM_EYES_AND_BROWS`) then
					name, value = "eyes", creator.readInt(64)
				elseif creator.getFocused(`MPCC_UI_FOCUS_ITEM_NOSE`) then
					name, value = "nose", creator.readInt(69)
				elseif creator.getFocused(`MPCC_UI_FOCUS_ITEM_MOUTH_AND_LIPS`) then
					name, value = "mouth", creator.readInt(74)
				elseif creator.getFocused(`MPCC_UI_FOCUS_ITEM_JAW_AND_CHIN`) then
					name, value = "jaw", creator.readInt(79)
				elseif creator.getFocused(`MPCC_UI_FOCUS_ITEM_EARS`) then
					name, value = "ears", creator.readInt(84)
				elseif creator.getFocused(`MPCC_UI_FOCUS_ITEM_CHEEKS`) then
					name, value = "cheeks", creator.readInt(89)
				end		
				
				if name then
					local expression = GetComponentFromPreset(ped, name, value)

					if expression then
						SetPedDefaultFaceFeature(ped, name)

						for feature, value in pairs(expression) do
							if Config.Expressions[feature] then
								SetPedFaceFeature(ped, Config.Expressions[feature], value)
							else
								print(("Face feature %s doesn't exist!"):format(feature))
							end
						end	

						creator.set(("expressions/%s"):format(name), value)
						RefreshPed(ped)
					end
				end
			elseif (uiItem["category"] == "overlays") then
				local name, value

				if creator.getFocused(`MPCC_UI_FOCUS_ITEM_FACE_EYEBROWS_OPTION`) then
					name, value = "eyebrows", creator.readInt(60)
				elseif creator.getFocused(-152557498) then
					name, value = "mottling", creator.readInt(172, true)
				elseif creator.getFocused(`MPCC_UI_FOCUS_ITEM_FACE_COMPLEXION_OPTION`) then
					name, value = "complexion", creator.readInt(178, true)
				elseif creator.getFocused(`MPCC_UI_FOCUS_ITEM_FACE_COMPLEXION_2_OPTION`) then
					name, value = "complexion_2", creator.readInt(181, true)
				elseif creator.getFocused(-703865325) then
					name, value = "freckles", creator.readInt(184, true)
				elseif creator.getFocused(-861918092) then
					name, value = "moles", creator.readInt(187, true)
				elseif creator.getFocused(-1662451772) then
					name, value = "spots", creator.readInt(190, true)
				elseif creator.getFocused(`MPCC_UI_FOCUS_ITEM_FACE_SCAR_OPTION`) then
					name, value = "scar", creator.readInt(193, true)
				elseif creator.getFocused(-951031692) then
					name, value = "foundation", creator.readInt(199, true)
				elseif creator.getFocused(-2041745821) then
					name, value = "blusher", creator.readInt(202, true)
				elseif creator.getFocused(`MPCC_UI_FOCUS_ITEM_FACE_EYESHADOW_OPTION`) then
					name, value = "eyeshadow", creator.readInt(208, true)
				elseif creator.getFocused(1814754636) then
					name, value = "eyeshadow_color", creator.readInt(226)
				elseif creator.getFocused(-1212243458) then
					name, value = "eyeliner", creator.readInt(205, true)
				elseif creator.getFocused(`MPCC_UI_FOCUS_ITEM_FACE_LIPSTICK_OPTION`) then
					name, value = "lipstick", creator.readInt(211, true)
				elseif creator.getFocused(505087938) then
					name, value = "lipstick_color", creator.readInt(233)
				end
				
				if name then
					local update = false

					if not name:match("color") then
						if not (value == 0) then
							local overlay = GetComponentFromPreset(ped, name, value)

							if overlay then
								creator.set(("overlays/%s"):format(name), value)

								update = true
							end
						else
							creator.set(("overlays/%s"):format(name), 0)

							update = true
						end
					else
						creator.set(("overlays/%s"):format(name), value)

						update = true
					end

					if update then
						SetPedOverlays(ped, creator.get("overlays", {}), creator.readInt(38), true)
					end
				end
			elseif (uiItem["category"] == "whistle") then
				local setting, value

				if creator.getFocused(`MPCC_UI_FOCUS_ITEM_WHISTLE_STYLE`) then
					setting, value = "style", creator.readInt(261, true)
				elseif creator.getFocused(`MPCC_UI_FOCUS_ITEM_WHISTLE_PITCH`) then
					setting, value = "pitch", creator.readInt(264, true) * 0.01
				elseif creator.getFocused(`MPCC_UI_FOCUS_ITEM_WHISTLE_CLARITY`) then
					setting, value = "clarity", creator.readInt(268, true) * 0.01
				end
				
				if setting then
					SetPedWhistleSetting(ped, setting, value)

					creator.set(("whistle/%s"):format(setting), value)
				end
			else
				local name, value

				if creator.getFocused('MPCC_UI_FOCUS_ITEM_HEAD_EYE_COLOR_OPTION') then
					name, value = "eye_color", creator.readInt(54)
				elseif creator.getFocused('MPCC_UI_FOCUS_ITEM_HEAD_TEETH_OPTION') then
					name, value = "teeth", creator.readInt(94)
				end

				if name then
					local component = GetComponentFromPreset(ped, name, value)

					if component then
						SetPedComponentEnabled(ped, component, true)

						creator.set(name, value)
					end
				end
			end

			if not HasPedComponentsLoaded(ped) then
				Citizen.CreateThread(function()
					while not HasPedComponentsLoaded(ped) do
						Citizen.Wait(0)
					end

					creator.eventsHandling(true)
				end)	
			else
				creator.eventsHandling(true)
			end
		end
	end)

	creator.addEventHandler(-2075827635, function(data) -- ui page changed
		local uiPage = Config.UIItems[data["hashParam"]]

		if uiPage then
			if uiPage["zoom"] then
				view = SetCameraView(cam, uiPage["zoom"], 1200, ped)
			end
		end
	end)

	creator.addEventHandler(-1740156697, function(data) -- ui item focus changed
		local uiItem = Config.UIItems[data["hashParam"]]

		if uiItem then
			if uiItem["zoom"] then
				if creator.getPage("MPCC_UI_FOCUS_ITEM_PAGE_APPEARANCE_MAIN") then
					Citizen.CreateThread(function()
						while not (GetTaskMoveNetworkState(ped) == "Still_Idle") do
							Citizen.Wait(0)
						end

						while not IsTaskMoveNetworkReadyForTransition(ped) do
							Citizen.Wait(0)
						end

						view = SetCameraView(cam, uiItem["zoom"], 1200, ped)
					end)
				else
					view = SetCameraView(cam, uiItem["zoom"], 1200, ped)
				end
			end

			local uiAnim = uiItem["anim"]
			if uiAnim then
				if DoesAnimDictExist(uiAnim["dict"]) then
					if HasAnimDictLoaded(uiAnim["dict"]) then
						TaskPlayAnim(ped, uiAnim["dict"], uiAnim["in"], 1.5, -4.0, -1, 16, 0.0, false, 0, false, 0, false)

						Citizen.CreateThread(function()
							while not IsEntityPlayingAnim(ped, uiAnim["dict"], uiAnim["in"], 3) do
								Citizen.Wait(0)
							end

							while not (GetEntityAnimCurrentTime(ped, uiAnim["dict"], uiAnim["in"]) > 0.95) do
								Citizen.Wait(0)
							end

							TaskPlayAnim(ped, uiAnim["dict"], uiAnim["loop"], 8.0, -4.0, -1, 17, 0.0, false, 0, false, 0, false)						
						end)

						dict, anim = uiAnim["dict"], uiAnim["out"]
					end
				else
					print(("Anim dict doesn't exist %s."):format(uiAnim["dict"]))
				end
			else
				if dict and anim then
					TaskPlayAnim(ped, dict, anim, 4.0, -1.5, -1, 16, 0.0, false, 0, false, 0, false)
					dict, anim = nil, nil
				end
			end
		end
	end)

	creator.addEventHandler(`ZOOM`, function(zoomed)
		if view and Config.Views[view] then
			if Config.Views[view].close then
				SetCameraView(cam, ("%s%s"):format(view, ((zoomed and "_CLOSE") or "")), 1200, ped)
			end
		end
	end)

	creator.addEventHandler(`CLOSE`, function()
		if cam then
			RenderScriptCams(false, false, 0, false, false, 0)
			DestroyCam(cam)
		end

		ClearFacialIdleAnimOverride(ped)
		ClearPedTasks(ped)

		Streamings(false, true)
	end)

	creator.open()
end

ApplyCharacter = function(ped, character, cb)
	if not DoesEntityExist(ped) then
		return false
	end

	if not character or type(character) ~= "table" then
		return false
	end

	local gender = (IsPedMale(ped) and "M") or "F"

	for name, data in pairs(character) do
		if (name == "root") then
			local tone = data["tone"] or 1
			local build = data["build"] or 1

			local head = GetComponentFromPreset(ped, "head", data["head"] or 1)
			local body = GetComponentFromPreset(ped, "body_build", build)

			if head then
				SetPedComponentEnabled(ped, head:format(tone))	
			end

			if body then
				SetPedComponentEnabled(ped, ("CLOTHING_ITEM_%s_BODIES_LOWER_%03d_V_%03d"):format(gender, build, tone))
				SetPedComponentEnabled(ped, ("CLOTHING_ITEM_%s_BODIES_UPPER_%03d_V_%03d"):format(gender, build, tone))

				SetPedBodyComponent(ped, body)
			end

		elseif (name == "hairs") then
			for vName, vData in pairs(data) do
				local palette = Config.Palettes["hairs"][vData.color]

				if palette then
					local component = GetComponentFromPreset(ped, vName, vData.style):format(palette)

					if component then
						SetPedComponentEnabled(ped, component)
					end
				end
			end

		elseif (name == "expressions") then
			for vName, vData in pairs(data) do
				local expression = GetComponentFromPreset(ped, vName, vData)

				if expression then
					SetPedDefaultFaceFeature(ped, vName)

					for feat, value in pairs(expression) do
						if Config.Expressions[feat] then
							SetPedFaceFeature(ped, Config.Expressions[feat], value)
						end
					end
				end
			end
		elseif (name == "whistle") then
			for vName, vData in pairs(data) do
				SetPedWhistleSetting(ped, vName, vData)
			end
		else
			local component = GetComponentFromPreset(ped, name, data)

			if component then
				SetPedComponentEnabled(ped, component)
			end
		end
	end

	if character["overlays"] then
		local root = character["root"] or {}
		local tone = root["tone"] or 1

		SetPedOverlays(ped, character["overlays"], tone)
	end

	RefreshPed(ped)
	while not HasPedComponentsLoaded(ped) do
		Citizen.Wait(0)
	end

	if cb then
		cb()
	end

	return true
end

ApplyPlayerModel = function(player, model, load, cb)
	if type(model) ~= "number" then
		model = GetHashKey(model)
	end

	if not NetworkIsPlayerActive(player) then
		return
	end

	if not IsModelInCdimage(model) then
		return
	end

	if not IsModelAPed(model) then
		return
	end

	RequestModel(model)
	while not HasModelLoaded(model) do
		Citizen.Wait(0)
	end

	SetPlayerModel(player, model)
	N_0x283978a15512b2fe(GetPlayerPed(player), true)

	if load then
		while not HasPedComponentsLoaded(GetPlayerPed(player)) do
			Citizen.Wait(0)
		end
	end

	SetModelAsNoLongerNeeded(model)

	if cb then cb() end
	return true
end

SetPedComponentEnabled = function(ped, component, refresh)
	if (type(component) ~= "number") then
		component = GetHashKey(component)
	end

	N_0xd3a7b003ed343fd9(ped, component, false, true, false)
	N_0x66b957aac2eaaeab(ped, component, 0, 0, 1, 1)
	N_0xaab86462966168ce(ped, 1)

	if refresh then
		RefreshPed(ped)
	end
end

SetPedComponentDisabled = function(ped, component, refresh)
	if (type(component) ~= "number") then
		component = GetHashKey(component)
	end

	N_0xd710a5007c2ac539(ped, component, 0)

	if refresh then
		RefreshPed(ped)
	end
end

SetPedBodyComponent = function(ped, component, refresh)
	if type(component) == "string" then
		component = GetHashKey(component)
	end
			
	N_0x1902c4cfcc5be57c(ped, component)
	N_0xaab86462966168ce(ped, 1)

	if refresh then
		RefreshPed(ped)
	end
end

SetPedFaceFeature = function(ped, index, value, refresh)
	N_0x5653ab26c82938cf(ped, index, value)
	N_0xaab86462966168ce(ped, 1)

	if refresh then
		RefreshPed(ped)
	end
end

SetPedOverlays = function(ped, overlays, tone, refresh)
	local textureId = CreatePedOverlayTexture(ped, tone)

	if not textureId then
		print("Failed to create overlay texture.")

		return
	end

	for name, value in pairs(overlays) do
		if not name:match("color") then
			local overlay = GetComponentFromPreset(ped, name, value)

			if overlay then				
				if (name == "eyeshadow" or name == "lipstick") then
					overlay.tint = overlays[("%s_color"):format(name)] or 1

					if overlay.tint then
						if (name == "lipstick") then
							overlay.tint = overlay.tint+4
						end
					end
				end

				SetTextureOverlayEnabled(textureId, overlay)
			end
		end
	end

	while not HasTextureOverlayLoaded(textureId) do
		Citizen.Wait(0)
	end

	ApplyTextureOverlayToPed(ped, textureId, `HEADS`)

	if refresh then
		RefreshPed(ped)
	end
end

SetPedWhistleSetting = function(ped, setting, value)
	if (setting == "whistle_shape" or setting == "shape") then
		N_0x9963681a8bc69bf3(ped, "Ped.WhistleShape", value+0.0)
	elseif (setting == "whistle_pitch" or setting == "pitch") then
		N_0x9963681a8bc69bf3(ped, "Ped.WhistlePitch", value+0.0)
	elseif (setting == "whistle_clarity" or setting == "clarity") then
		N_0x9963681a8bc69bf3(ped, "Ped.WhistleClarity", value+0.0)
	end
end

TaskMoveNetworkAdvanced = function(ped)
	local pos = { table.unpack(GetEntityCoords(ped, true, false)) }
	local rot = { table.unpack(GetEntityRotation(ped, 2)) }
	local def = "Character_Creator"
	local clipset = ("CLIPSET@MP_CHARACTER_CREATOR@%s"):format(IsPedMale(ped) and "MALE" or "FEMALE")

	Streamings(true, true)

	exports[GetCurrentResourceName()]:TASK_MOVE_NETWORK_ADVANCED_BY_NAME_WITH_INIT_PARAMS(ped, pos, rot, def, clipset, "BODY_SIZE", 0.0, "STEP_SIGNAL", 0.5, "IDLE_STATE")			
	while not IsTaskMoveNetworkActive(ped) do
		Citizen.Wait(0)
	end

	N_0x615dc4a82e90bb48(ped, `CLIPSET@MP_CHARACTER_CREATOR@MALE`, 184808581)
	ForcePedMotionState(ped, 247561816, false, 0, false)
	while not IsTaskMoveNetworkReadyForTransition(ped) do
		Citizen.Wait(0)
	end

	RequestTaskMoveNetworkStateTransition(ped, "Turn_to_Face_Transition")
	while not IsTaskMoveNetworkReadyForTransition(ped) do
		Citizen.Wait(0)
	end

	RequestTaskMoveNetworkStateTransition(ped, "Still_Idle")
	while not IsTaskMoveNetworkReadyForTransition(ped) do
		Citizen.Wait(0)
	end
end

SetCameraView = function(cam, name, trans, ped, fade)
	if not Config.Views[name] then
		return
	end

	if not DoesCamExist(cam) then
		return
	end

	local view = Config.Views[name]

	local pos = GetOffsetFromEntityInWorldCoords(ped, view.offset)
	local rot = vector3(0.0, 0.0, GetEntityHeading(ped)-180.0)

	SetCamParams(cam, pos, rot, view.fov, trans or 0, 1, 1, 2, 1, 1);
	N_0x11f32bb61b756732(cam, view.focus)

	RenderScriptCams(true, fade or false, 1200, true, false, 0)
	ShakeCam(cam, "HAND_SHAKE", 0.04)

	return name
end

CreatePedOverlayTexture = function(ped, tone)
	local gender = (IsPedMale(ped) and "male") or "female"
	local base = Config.PedTextures[gender]

	if base then
		local albedo = base["ab"][tone]

		if albedo then
			if Storage[ped] then
				N_0xb63b9178d0f58d82(Storage[ped])
				N_0x6befaa907b076859(Storage[ped])
			end

			local textureId = N_0xc5e7204f322e49eb(albedo, base.nm, base.ma)
			Storage[ped] = textureId

			return textureId
		end
	end

	return
end

SetTextureOverlayEnabled = function(textureId, overlay)
	local tint = (overlay.tint and Config.Palettes["overlays"][overlay.tint]) or {}
	local overlayId = N_0x86bb5ff45f193a02(textureId, GetHashKey(overlay.id), GetHashKey(overlay.nm) or 0, GetHashKey(overlay.ma) or 0, overlay.type or 0, 1.0, 0)

	if overlay.type == 0 then
		N_0x1ed8588524ac9be1(textureId, overlayId, tint.palette or 0x3F6E70FF) --// Palette
		N_0x2df59ffe6ffd6044(textureId, overlayId, tint.shift or 0, 0, 0) --// Color shift
	end

	N_0x3329aae2882fc8e4(textureId, overlayId, overlay.variant or 0) --// Variant
	N_0x6c76bc24f8bb709a(textureId, overlayId, 1.0) --// Alpha	
end

ApplyTextureOverlayToPed = function(ped, textureId, category)
	N_0x0b46e25761519058(ped, category, textureId)
    N_0x92daaba2c1c10b0e(textureId)
end

HasTextureOverlayLoaded = function(textureId) 
	return ((N_0x31dc8d3f216d8509(textureId) == 1 and true) or false)
end

RefreshPed = function(ped)
	N_0xcc8ca3e88256e58f(ped, false, true, true, true, false)
end

GetEntityAnimCurrentTime = function(ped, dict, anim)
	return Citizen.InvokeNative(0x627520389E288A73, ped, dict, anim, Citizen.ResultAsFloat())
end

HasPedComponentsLoaded = function(ped)
	return ((N_0xa0bc8faed8cfeb3c(ped) == 1 and true) or false)
end

SetPedDefaultFaceFeature = function(ped, feature, refresh)
	if Config.ExpressionsNames[feature] then
		for _,expression in ipairs(Config.ExpressionsNames[feature]) do
			if Config.Expressions[expression] then
				SetPedFaceFeature(ped, Config.Expressions[expression], 0.0)
			end			
		end

		if refresh then
			RefreshPed(ped)
		end
	end
end

GetComponentFromPreset = function(ped, category, preset)
	if Config.Presets[category] then
		if Config.Presets[category].m or Config.Presets[category].f then
			if IsPedMale(ped) then
				return Config.Presets[category].m[preset]
			else
				return Config.Presets[category].f[preset]
			end
		else
			return Config.Presets[category][preset]
		end
	end

	return
end

Streamings = function(load, interior)
	local def = "Character_Creator"
	if load then
		N_0x2b6529c54d29037a(def)
		while not N_0x2c04d89a0fb4e244(def) do
			Citizen.Wait(0)
		end
	else
		N_0x57a197ad83f66bbf(def)
	end

	local clipsets = { "CLIPSET@MP_CHARACTER_CREATOR@MALE", "CLIPSET@MP_CHARACTER_CREATOR@FEMALE" }
	for _,clipset in ipairs(clipsets) do
		if load then
			RequestClipSet(clipset)
			while not HasClipSetLoaded(clipset) do
				Citizen.Wait(0)
			end
		else
			RemoveClipSet(clipset)
		end
	end

	local dicts = { "mp_character_creator@male@fidgets", "mp_character_creator@female@fidgets", "SCRIPT_COMMON@TAILOR_SHOP", "MECH_LOCO_F@TYPE@COWGIRL@NORMAL@UNARMED@IDLE", "FACE_HUMAN@GEN_MALE@BASE" }	
	for _,dict in ipairs(dicts) do
		if load then
			RequestAnimDict(dict)
			while not HasAnimDictLoaded(dict) do
				Citizen.Wait(0)
			end
		else
			RemoveAnimDict(dict)
		end
	end

	if interior then
		local imaps = { `MP001_MP_LOBBY_CHARMILO_EXT`, 1679934574, 183712523 }
		for _,imap in ipairs(imaps) do
			if load then
				RequestImap(imap)
			else
				RemoveImap(imap)
			end
		end
	end
end

AddEventHandler("onResourceStop", function(rsc)
	if GetCurrentResourceName() == rsc then
		for k,v in pairs(Storage) do
			N_0xb63b9178d0f58d82(v)
			N_0x6befaa907b076859(v)
		end
	end
end)