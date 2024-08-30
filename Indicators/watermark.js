//@version=5
indicator("Watermark", overlay=true)

showTF = input.bool(true, "Show time frame", inline = "24")
showpf = input.bool(false, "Show Exchange", inline = "24")
showchange = input.bool(false, "Show change %", inline = "24")
showSymbol = input.bool(false, "Show Symbol", inline = "24")
string  i_tableYpos = input.string("bottom", "Position", inline = "12", options = ["top", "middle", "bottom"])
string  i_tableXpos = input.string("right", "", inline = "12", options = ["left", "center", "right"])
size1 = input.string("huge", "title", inline = "14", options = ["tiny", "small", "normal", "large", "huge", "auto"])
size3 = input.string("large", "change", inline = "14", options = ["tiny", "small", "normal", "large", "huge", "auto"])
size2 = input.string("small", "signature", inline = "14", options = ["tiny", "small", "normal", "large", "huge", "auto"])
color = input.color(#ffeb3b, "color")
signature = input.string("by you", "your signature")
seperator = input.string("/", "separator")

changeClose = request.security(syminfo.tickerid, timeframe.period, close)

cur = syminfo.currency
base = syminfo.basecurrency
exchange = syminfo.prefix

getTimeFrame() =>
    tf = timeframe.multiplier
    tfstr = ""
    if timeframe.isseconds
        tfstr := "s"
    if timeframe.isminutes
        if tf >= 60
            tf := tf / 60
            tfstr := "h"
        else
            tfstr := "m"
    if timeframe.isdaily
        tfstr := "D"
    if timeframe.isweekly
        tfstr := "W"
    if timeframe.ismonthly
        tfstr := "M"  
    [tfstr, str.tostring(tf)]

var table table1 = table.new(i_tableYpos + "_" + i_tableXpos , 4, 1)

if barstate.islast
    str1 = showSymbol ? (base != "" ? base + seperator + cur : syminfo.ticker) : ""
    [tf, period] = getTimeFrame()
    
    change = math.round(((changeClose[0] / changeClose[1]) - 1) * 100, 2)
    changeStr = ""
    if change > 0 
        changeStr := "▲" + str.tostring(math.abs(change)) + "%"
    else
        changeStr := "▼" + str.tostring(math.abs(change)) + "%"

    table.cell(table1, 0, 0, showpf ? exchange : "", text_color = color, width=0, text_size=size2)
    table.cell(table1, 1, 0, str1 + (showTF ? (" " + period + tf) : ""), width=0, text_color = color, text_size=size1)
    table.cell(table1, 2, 0, showchange ? changeStr : "", width=0, text_color = change > 0 ? color.green : color.red, text_size=size3)
    table.cell(table1, 3, 0, signature, text_color = color, width=0, text_size=size2)
