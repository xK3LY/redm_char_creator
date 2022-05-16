InitCreator = function(ped, character)
	local self = {}

	self.character = table.copy(character or {})
	self.gender = (IsPedMale(ped) and "M") or "F"
	self.model = GetEntityModel(ped)

	self.databinding = exports[GetCurrentResourceName()]:SetupDatabinding(ped, character or {}, Config.Presets, Config.Swatches)
	self.eventHandlers = {}
	self.controls = true
	self.focused = nil
	self.page = nil


	--[[ Common ]]--
	self.getGender = function()
		return self.gender
	end
	self.getModel = function()
		return self.model
	end
	self.getFocused = function(itemHash)
		if itemHash then
			if type(itemHash) ~= "number" then
				itemHash = GetHashKey(itemHash)
			end 
			
			return self.focused == itemHash
		end

		return self.focused
	end
	self.getPage = function(pageHash)
		if pageHash then
			if type(pageHash) ~= "number" then
				itemHash = GetHashKey(pageHash)
			end 
			
			return self.page == itemHash
		end

		return self.page
	end
	self.eventsHandling = function(bool)
		self.controls = bool
	end

	--[[ Character ]]--
	self.getCharacter = function()
		return self.character
	end
	self.get = function(path, def)
		path = path:split("/")

		local lastDir
		for index, dir in ipairs(path) do
			if not lastDir then
				lastDir = self.character
			end

			if not lastDir[dir] then
				break 
			end

			lastDir = lastDir[dir]
		end

		return lastDir or def
	end
	self.set = function(path, value)
		path = path:split("/")

		local lastDir
		for index, dir in ipairs(path) do
			if not lastDir then
				lastDir = self.character
			end

			if not lastDir[dir] then
				lastDir[dir] = {}
			end

			if not (index == #path) then
				lastDir = lastDir[dir]
			else
				lastDir[dir] = value
			end
		end
	end
	

	--[[ Databinding ]]--
	self.getContainer = function(id)
		return self.databinding[tostring(id)]
	end
	self.setContainer = function(id, handle)
		self.databinding[tostring(id)] = handle
	end
	self.removeContainer = function(id)
		DatabindingRemoveDataEntry(self.getContainer(id))
	end

	self.getHashArrayLength = function(id)
		return Citizen.InvokeNative(0xD23F5DE04FE717E2, self.getContainer(id), Citizen.ResultAsInteger())
	end
	self.readHashFromArray = function(id, index)
		return N_0xf47e33f8d2523825(self.getContainer(id), self.readInt(index, true))
	end

	self.readInt = function(id, zeroIndex)
		return DatabindingReadDataInt(self.getContainer(id)) + ((zeroIndex and 0) or 1)
	end
	self.readBool = function(id)
		local bool = DatabindingReadDataBool(self.getContainer(id))
		return (bool == 1 and bool) or false
	end	
	self.readHash = function(id)
		return DatabindingReadDataHashString(self.getContainer(id))
	end
	self.readString = function(id)
		return DatabindingReadDataString(self.getContainer(id))
	end

	self.writeInt = function(id, int)
		DatabindingWriteDataInt(self.getContainer(id), int)
	end
	self.writeBool = function(id, bool)
		DatabindingWriteDataBool(self.getContainer(id), bool)
	end
	self.writeHash = function(id, hash)
		DatabindingWriteDataHashString(self.getContainer(id), hash)
	end
	self.writeString = function(id, string)
		DatabindingWriteDataString(self.getContainer(id), string)
	end


	--[[ Main ]]--
	self.open = function()
		if Citizen.InvokeNative(0x4E511D093A86AD49, `CHARACTER_CREATOR`) then
			CloseAppByHashImmediate(`CHARACTER_CREATOR`)
		end

		SetFacialIdleAnimOverride(ped, "mood_normal_zoom", "FACE_HUMAN@GEN_MALE@BASE")
		TaskMoveNetworkAdvanced(ped)

		if N_0xd0976cc34002db57("NETCHAR") == 0 then
			N_0xf66090013de648d5("NETCHAR")

			while N_0xd0976cc34002db57("NETCHAR") == 0 do
				Citizen.Wait(0)
			end	
		end

		self.generateSwatches()

		LaunchAppByHash(`CHARACTER_CREATOR`)
		while true do
			if Citizen.InvokeNative(0x67ED5A7963F2F722, `UI_CHARACTER_CREATOR_EVENTS`) then
				local eventData = exports[GetCurrentResourceName()]:_EVENT_MANAGER_PEEK_EVENT(`UI_CHARACTER_CREATOR_EVENTS`)

				if eventData then
					if (eventData["eventType"] == -1740156697) then
						self.focused = eventData["hashParam"]
					elseif (eventData["eventType"] == -2075827635) then
						self.page = eventData["hashParam"]
					end

					if eventData["eventType"] == -1151569080 then
						if self.controls then
							self.triggerEvent(eventData["eventType"], eventData)
						end
					else
						self.triggerEvent(eventData["eventType"], eventData)
					end
				end

				Citizen.InvokeNative(0x8E8A2369F48EC839, `UI_CHARACTER_CREATOR_EVENTS`)
			end

			if IsControlJustPressed(0, `INPUT_INSPECT_ZOOM`) then
				self.triggerEvent(`ZOOM`, true)

				Citizen.SetTimeout(0, function()
					while IsControlPressed(0, `INPUT_INSPECT_ZOOM`) do
						Citizen.Wait(0)
					end

					self.triggerEvent(`ZOOM`, false)
				end)
			end

			if not Citizen.InvokeNative(0x4E511D093A86AD49, `CHARACTER_CREATOR`) then
				if (UpdateOnscreenKeyboard() == 0) then
					while not Citizen.InvokeNative(0x4E511D093A86AD49, `CHARACTER_CREATOR`) do
						Citizen.Wait(0)
					end
				else
					break
				end
			end

			if (GetEntityModel(ped) ~= self.getModel()) then
				self.triggerEvent(-1203660660, { hashParam = `MPCC_UI_SELECT_EVENT_CANCEL_EDIT` })			
				print("Closed char creator app due to player model change.")

				break
			end

			Citizen.Wait(0)
		end
	end
	self.close = function(cb, immediate)
		if immediate then
			CloseAppByHashImmediate(`CHARACTER_CREATOR`)
		else
			CloseAppByHash(`CHARACTER_CREATOR`)
		end

		DatabindingRemoveDataEntry(self.databinding["0"])
		N_0xaa03f130a637d923("NETCHAR")
		N_0xdad7fb8402651654()

		self.triggerEvent(`CLOSE`, {})

		if cb then cb() end
		self.destroy()
	end
	self.destroy = function()
		self = nil
		
		collectgarbage("collect")
	end


	--[[ Swatches ]]--
	self.generateSwatches = function()
		N_0xdad7fb8402651654()
		while N_0x3d084d5568fb4028(62) ~= 1 do
			Citizen.Wait(0)
		end

		for name, data in pairs(Config.Swatches) do
			if data.pattern then
				for i=data.offset, (data.offset+data.size-1) do
					local index = (i-data.offset)+1
					local swatch = data.pattern:format((data.values and data.values[index]) or index)

					if data.directly then
						exports[GetCurrentResourceName()]:_GENERATE_SWATCH_TEXTURE_DIRECTLY(i, "UIsw_flat_ck000", "Metaped_tint_Generic_clean", swatch)
					else
						N_0x160921255327c591(i, GetHashKey(swatch), 0, true)
					end
				end
			end
		end
	end
	self.showSwatches = function(name)
		local swatch = Config.Swatches[name]

		if swatch then
			self.setContainer(114, DatabindingAddDataContainer(self.getContainer(110), "Items"))
			for i=swatch.offset, (swatch.offset + swatch.size-1) do			
				local uiItem = DatabindingAddDataContainer(self.getContainer(114), "Item" .. i-swatch.offset)
				DatabindingAddDataString(uiItem, "TextureDictionary", "SwatchTxd")
				DatabindingAddDataString(uiItem, "Texture", ("slot%02d"):format(i));
				DatabindingInsertUiItemToListFromContextStringAlias(self.getContainer(115), i, "color_palette_entry", uiItem)	
			end	

			self.writeInt(113, self.readInt(swatch.c_value, true))
			self.writeString(112, swatch.label)

			self.writeBool(111, true)
		end
	end
	self.hideSwatches = function()	
		self.writeBool(111, false)

		Citizen.InvokeNative(0x3BF0767CF33FCC88, self.getContainer(115))
		self.removeContainer(114)	
	end


	--[[ Images ]]--
	self.showImage = function(image)
		self.writeHash(9, image)
		self.writeBool(8, true)
	end
	self.hideImage = function()	
		self.writeBool(8, false)
	end


	--[[ Tooltip ]]--
	self.showTooltip = function(tooltip)
		self.writeString(5, GetLabelText(tooltip))	
	end
	self.hideTooltip = function()	
		self.writeString(5, "")
	end


	--[[ Events ]]--
	self.triggerEvent = function(eventHash, data)
		if self.eventHandlers[eventHash] then
			for _,cb in ipairs(self.eventHandlers[eventHash]) do
				cb(data)

				--Citizen.SetTimeout(0, function()
				--	cb(data)
				--end)
			end
		end
	end
	self.addEventHandler = function(eventHash, cb)
		if not self.eventHandlers[eventHash] then
			self.eventHandlers[eventHash] = {}
		end

		table.insert(self.eventHandlers[eventHash], cb)
	end


	--[[ Event handlers ]]--
	self.addEventHandler(-2075827635, function(data) --// Page changed //--
		local uiPage = Config.UIItems[data["hashParam"]]

		if uiPage then
			self.writeHash(2, uiPage.label or 0)
			self.writeHash(3, uiPage.sublabel or 0)
		else
			print(("Failed find uiPage hash %s."):format(data["hashParam"]))
		end
	end)
	self.addEventHandler(-1740156697, function(data) --// Item changed  //--
		local uiItem = Config.UIItems[data["hashParam"]]

		if uiItem then
			local swatch = uiItem["swatch"]
			if swatch then
				self.showSwatches(swatch)
			else
				self.hideSwatches()
			end

			local image = uiItem["image"]
			if image then
				self.showImage(image)
			else
				self.hideImage()
			end

			local tooltip = uiItem["tooltip"]
			if tooltip then
				self.showTooltip(tooltip)	
			else
				self.hideTooltip()
			end	
		else
			print(("Failed find uiItem hash %s."):format(data["hashParam"]))
		end
	end)
	self.addEventHandler(-1151569080, function(data) --// Data changed //--
		if data["force"] then
			return
		end

		if self.readBool(111) then
			local arraySize = Citizen.InvokeNative(0xD23F5DE04FE717E2, self.getContainer(115), Citizen.ResultAsInteger())

			if arraySize > 0 then
				local uiItem = Config.UIItems[self.getFocused()]

				if uiItem then
					if uiItem["swatch"] then
						self.writeInt(113, ((self.readInt(113, true) + data["intParam"]) % arraySize))

						local swatch = Config.Swatches[uiItem["swatch"]]
						if swatch then
							self.writeString(swatch.c_txd, ("slot%02d"):format(swatch.offset + self.readInt(113, true)))
							self.writeInt(swatch.c_value, self.readInt(113, true))
						end
					else
						print(("Failed get swatch from uiItemSwatch hash %s."):format(self.getFocused()))
					end
				else
					print(("Failed find uiItemSwatch hash %s."):format(self.getFocused()))
				end
			end
		end
	end)

	AddEventHandler("onResourceStop", function(rsc)
		if GetCurrentResourceName() == rsc then
			if self then
				self.close(nil, true)
			end
		end
	end)

	return self
end
