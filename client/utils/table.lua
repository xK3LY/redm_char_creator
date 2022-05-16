function table.copy(orig)
    local copy

    if type(orig) == 'table' then
        copy = {}
        for orig_key, orig_value in next, orig, nil do copy[table.copy(orig_key)] = table.copy(orig_value) end
        setmetatable(copy, table.copy(getmetatable(orig)))
    else copy = orig end

    return copy
end