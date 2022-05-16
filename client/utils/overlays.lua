local function GetColorType(name)
	if name == "scar" or name == "spots" or name == "disc" or name == "complex" or name == "acne" or name == "ageing" or name == "moles" or name == "freckles" then
		return 1
    end

	return 0
end

local function GetVariant(name, i)
	if name == "eyeshadow" or name == "lipstick" then
		return i
	end

	return 0
end

GetOverlays = function(name, count, layers, gender)
	local result = {}

	if gender then
		result["m"] = {}
		result["f"] = {}

		for sex in pairs(result) do
			if (name == "eyebrow" and sex == "f") then
				count = 8
			end

			for i=0, count-1 do
				local overlay = {}

				overlay["type"] = GetColorType(name)
				overlay["variant"] = GetVariant(name, i)

				table.insert(layers, 1, "id")
				for _,layer in ipairs(layers) do
					local index = (overlay["variant"] > 0 and 0) or i

					if layer == "id" then
						overlay[layer] = ("mp_u_faov_%s_%s_%03d"):format(name, sex, index)
					else
						overlay[layer] = ("mp_u_faov_%s_%s_%03d_%s"):format(name, sex, index, layer)
					end
				end

				table.insert(result[sex], overlay)
			end
		end
	else
		for i=0, count-1 do
			local overlay = {}

			overlay["type"] = GetColorType(name)
			overlay["variant"] = GetVariant(name, i)

			table.insert(layers, 1, "id")
			for _,layer in ipairs(layers) do
				local index = (overlay["variant"] > 0 and 0) or i

				if layer == "id" then
					overlay[layer] = ("mp_u_faov_%s_%03d"):format(name, index)
				else
					overlay[layer] = ("mp_u_faov_%s_%03d_%s"):format(name, index, layer)
				end
			end

			table.insert(result, overlay)
		end
	end

	return result
end