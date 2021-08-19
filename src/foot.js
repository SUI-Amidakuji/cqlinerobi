/* SJIS Bytes */
String.prototype.bytes = function () {
  var length = 0;
  for (var i = 0; i < this.length; i++) {
    var c = this.charCodeAt(i);
    if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
      length += 1;
    } else {
      length += 2;
    }
  }
  return length;
};
/* Emoji */
const regEmoji = new RegExp(
    [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]',
        '\ud7c9[\ude00-\udeff]',
        '[\u2600-\u27BF]'
    ]
    .join("|"), 'g');

class foot{
    constructor(){
        this.String_Max_Byte = 60;
        this.foot_elm;
        this.input_elm;
    }
    upt_foot_elm(){
        this.foot_elm = document.getElementsByClassName("foot")[0]
    }
    upt_foot_input(){
        this.input_elm = this.foot_elm.getElementsByClassName("message")[0].getElementsByTagName("input")[0];
    }
    count_StringByte(){
        let mojisu = 0;
        var str = this.input_elm.value;
        mojisu += this.meta_emoji(str).bytes();
        return mojisu;
    }
    meta_emoji(str){
        let ret_strings = str;
        //絵文字 -> &#..... に変換する。
        let emoji_list = ret_strings.match(regEmoji);
        if(emoji_list){  //絵文字ある場合のみ
            for(var emoji of emoji_list){
                ret_strings = ret_strings.replace(emoji, "&#x" + emoji.codePointAt(0).toString(16));
            }
        }
        return ret_strings;
    }
    isStringByte_Satisfy(){
        let byte = this.count_StringByte();
        return byte <= this.String_Max_Byte;
    }
    setSend_Message(str){
        this.input_elm.value = str;
    }
    getSend_Message(){
        return this.meta_emoji(this.input_elm.value);
    }
    StringByte_Message(boolean){
        var p_elm = this.foot_elm.getElementsByClassName("StringByte")[0].getElementsByTagName("p")[0];
        if(boolean){
            if(!p_elm.classList.contains("hidden")){
                p_elm.classList.add("hidden");
            }
        }else{
            p_elm.classList.remove("hidden");
        }
    }
    Mojisu_Counter_Update(String){
        var span = this.foot_elm.getElementsByClassName("mojisu")[0].getElementsByTagName("span")[0];
        span.textContent = String + "文字";
    }
}