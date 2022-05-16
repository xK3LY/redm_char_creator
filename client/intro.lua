RegisterCommand('creator_intro', function()
	Citizen.CreateThread(function()
		StartCharCreatorIntro()
	end)
end, true)

StartCharCreatorIntro = function()
	if not IsScreenFadedOut() and not IsScreenFadingOut() then
		DoScreenFadeOut(0)

		while not IsScreenFadedOut() do
			Citizen.Wait(0)
		end
	end

	local cam = SetupCamera()
	local animscene, peds = SetupAnimscene()

	AddEventHandler("onResourceStop", function(rsc)
		if GetCurrentResourceName() == rsc then
			Citizen.InvokeNative(0x84EEDB2C6E650000, animscene)
			DestroyCam(cam)

			LoadImaps(false)

			for k,v in ipairs(peds) do
				DeletePed(v)
			end
		end
	end)

	ShowBusyspinnerWithText('Loading char creator')
	StartPlayerTeleportAndWait(vector3(-557.2, -3779.1, 245.0))
	FreezeEntityPosition(PlayerPedId(), true)
	LoadImaps(true)

	LoadAnimScene(animscene)
	while not Citizen.InvokeNative(0x477122B8D05E7968, animscene) do
		Citizen.Wait(0)
	end

	StartAnimScene(animscene)
	while not Citizen.InvokeNative(0xCBFC7725DE6CE2E0, animscene) do
		Citizen.Wait(0)
	end

	BusyspinnerOff()
	DoScreenFadeIn(2000)

	local firstDialogue = false
	while not HasAnimEventFired(peds[3], 931807363) do
		if IsAnySpeechPlaying(peds[3]) and not firstDialogue then
			StopCurrentPlayingAmbientSpeech(peds[3], false)
			StopCurrentPlayingSpeech(peds[3], false)

			firstDialogue = true
		end

		Citizen.Wait(0)
	end

	ChooseAndOpenCreator(animscene, cam, peds, function(character)
		N_0x8bc7c1f929d07bf3(1779876696)

		print('creator_intro:', json.encode(character))
	end, function ()
		N_0x8bc7c1f929d07bf3(1779876696)
	end)
end

ChooseAndOpenCreator = function(animscene, cam, peds, onConfirm, onCancel)
	SetCamParams(cam, vector3(-562.15, -3776.22, 239.11), vector3(-4.71, 0.0, -93.14), 45.0, 0, 1, 1, 2, 1, 1)
	N_0x11f32bb61b756732(cam, 4.0)

	exports[GetCurrentResourceName()]:_UI_FEED_POST_OBJECTIVE(-1, 'Choose character')
	N_0x4cc5f2fc1332577f(1779876696)

	local char = 1
	while true do
		if IsControlJustPressed(0, `INPUT_CREATOR_MENU_TOGGLE`) then
			char = (char + 1) % 2

			local view = Config.Intro["views"][char+1]

			if view then
				SetCamParams(cam, view.pos, view.rot, view.fov, 1200, 1, 1, 2, 1, 1)
				N_0x11f32bb61b756732(cam, view.focus)

				local transEnd = false
				Citizen.SetTimeout(1200, function()
					transEnd = true
				end)

				while not transEnd do
					Citizen.Wait(0)
				end
			end
		end

		if IsControlJustPressed(0, `INPUT_CREATOR_ACCEPT`) then
			break
		end

		Citizen.Wait(0)
	end
	N_0xdd1232b332cbb9e7(3, 1, 0)

	local ped = peds[char+1]
	local gender = (IsPedMale(ped) and "Male") or "Female"

	Citizen.InvokeNative(0xAB5E7CAB074D6B84, animscene, ("Pl_Start_to_Edit_%s"):format(gender))
	while not (Citizen.InvokeNative(0x3FBC3F51BF12DFBF, animscene, Citizen.ResultAsFloat()) > 0.2) do
		Citizen.Wait(0)
	end

	SetCamParams(cam, vector3(-561.82, -3780.97, 239.08), vector3(-4.21, 0.0, -87.88), 30.0, 0, 1, 1, 2, 1, 1)
	N_0x11f32bb61b756732(cam, 1.0)

	while not (N_0xd8254cb2c586412b(animscene) == 1) do
		Citizen.Wait(0)
	end

	local creator = OpenCharCreator(function(character)
		if onConfirm then
			onConfirm(character)
		end
	end, function()
		if onCancel then
			onCancel()
		end
	end, {}, ped)
end

SetupAnimscene = function()
	local Male_MP = CreatePedAtCoords(`MP_MALE`, vector4(0.0, 0.0, 0.0, 0.0), false)
	SetPedOutfitPreset(Male_MP, 3, true)

	local Female_MP = CreatePedAtCoords(`MP_FEMALE`, vector4(0.0, 0.0, 0.0, 0.0), false)
	SetPedOutfitPreset(Female_MP, 3, true)

	local Sheriff = CreatePedAtCoords(`MP_U_M_O_BlWPoliceChief_01`, vector4(0.0, 0.0, 0.0, 0.0), false)
	AddEntityToAudioMixGroup(Sheriff, "rdro_character_creator_guard_group", 0.0)
	SetPedConfigFlag(Sheriff, 130, true)
	SetPedConfigFlag(Sheriff, 301, true)
	SetPedConfigFlag(Sheriff, 315, true)
	FreezeEntityPosition(Sheriff, true)

	local Deputy = CreatePedAtCoords(`CS_MP_MARSHALL_DAVIES`, vector4(0.0, 0.0, 0.0, 0.0), false)
	AddEntityToAudioMixGroup(Deputy, "rdro_character_creator_guard_group", 0.0)
	SetPedConfigFlag(Deputy, 130, true)
	SetPedConfigFlag(Deputy, 301, true)
	SetPedConfigFlag(Deputy, 315, true)
	GiveWeaponToPed_2(Deputy, `WEAPON_REPEATER_CARBINE`, 100, true, false, 0, false, 0.5, 1.0, 752097756, false, 0.0, false)
	FreezeEntityPosition(Deputy, true)

	local animscene = CreateAnimScene("script@mp@character_creator@transitions", 0.25, "pl_intro", false, true)
	SetAnimSceneEntity(animscene, "Male_MP", Male_MP, 0)
	SetAnimSceneEntity(animscene, "Female_MP", Female_MP, 0)
	SetAnimSceneEntity(animscene, "Sheriff", Sheriff, 0)
	SetAnimSceneEntity(animscene, "Deputy", Deputy, 0)

	return animscene, { Male_MP, Female_MP, Sheriff, Deputy }
end

SetupCamera = function()
	local camera = CreateCamera(`DEFAULT_SCRIPTED_CAMERA`, true)
	local pos = vector3(-562.15, -3776.22, 239.11)
	local rot = vector3(-4.71, 0.0, -93.14)

	SetCamParams(camera, pos, rot, 45.0, 0, 1, 1, 2, 1, 1)
	N_0x11f32bb61b756732(camera, 4.0)

	RenderScriptCams(true, false, 3000, true, true, 0)

	return camera
end

LoadImaps = function(load)
	local imaps = { `MP001_MP_LOBBY_CHARMILO_EXT`, 1679934574, 183712523 }
	for _,imap in ipairs(imaps) do
		if load then
			RequestImap(imap)
		else
			RemoveImap(imap)
		end
	end
end

CreatePedAtCoords = function(model, coords, isNetworked)
	if type(model) ~= "number" then model = GetHashKey(model) end

	if IsModelInCdimage(model) then
		isNetworked = isNetworked or false

		RequestModel(model)
		while not HasModelLoaded(model) do Citizen.Wait(10) end

		local handle = CreatePed(model, coords, isNetworked, isNetworked, false, false)
		Citizen.InvokeNative(0x283978A15512B2FE, handle, true)
		SetModelAsNoLongerNeeded(model)

		return handle
	end
end

ShowBusyspinnerWithText = function(text)
	N_0x7f78cd75cc4539e4(CreateVarString(10, "LITERAL_STRING", text))
end

StartPlayerTeleportAndWait = function(coords, findCollisionLand)
	if IsPlayerTeleportActive() then
		StopPlayerTeleport()
	end

	local hasBeenFrozen = Citizen.InvokeNative(0x083D497D57B7400F, PlayerPedId())
	if hasBeenFrozen then
		FreezeEntityPosition(PlayerPedId(), false)
	end

	StartPlayerTeleport(PlayerId(), coords.x, coords.y, coords.z, 0.0, true, (findCollisionLand or false), false, false)
	while not Citizen.InvokeNative(0xC39DCE4672CBFBC1, PlayerId()) do
		Citizen.Wait(0)
	end

	if hasBeenFrozen then
		FreezeEntityPosition(PlayerPedId(), true)
	end
end