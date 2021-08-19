class Main_Mes{
    constructor(id, names, timeSTR, image_url){
        this.id = id;
        this.names = names;
        this.timeSTR = timeSTR;
        this.image_url = image_url
        this.message_elm = this.message();
        this.div_elm = document.createElement("div");
    }
    main_mes(){
        let elm = document.createElement("div");
        elm.classList.add(this.id);
        elm.classList.add("main_mes");
        elm.classList.add("flex-start");
        return elm;
    }
    flex_message(pyoko_elm, message_elm){
        let elm = document.createElement("div");
        elm.classList.add("flex-start");
        elm.appendChild(pyoko_elm);
        elm.appendChild(message_elm);
        return elm;
    }
    icon(){
        let elm = document.createElement("div");
        let img = document.createElement("img");
        elm.classList.add("icon");
        img.setAttribute("src", this.image_url);
        elm.appendChild(img);
        return elm;
    }
    name_elm(){
        let elm = document.createElement("name");
        elm.classList.add("name");
        elm.textContent = this.names;
        return elm;
    }
    pyoko(){
        let elm = document.createElement("div");
        elm.classList.add("pyoko");
        return elm;
    }
    message(){
        let elm = document.createElement("div");
        elm.classList.add("message");
        return elm;
    }
    appendmessage(text){
        let elm = document.createElement("p");
        elm.textContent = text;
        this.message_elm.appendChild(elm);
        return elm;
    }
    right_menu(Message_Text){
        /* Electron右クリックメニュー */
        this.div_elm.oncontextmenu = () => {
            window.api.show_context_menu_message(Message_Text);
        }
        /* ==== */
    }
    time(){
        let elm = document.createElement("div");
        elm.classList.add("time");
        elm.textContent=this.timeSTR;
        return elm;
    }
    packing(){
        let main_mes_elm = this.main_mes();
        main_mes_elm.appendChild(this.icon());
        this.div_elm.appendChild(this.name_elm());
        this.div_elm.appendChild(this.flex_message(this.pyoko(), this.message_elm));
        main_mes_elm.appendChild(this.div_elm);
        main_mes_elm.appendChild(this.time());
        return main_mes_elm;
    }
}

class body{
    constructor(){
        this.THR_MINTIME = 5;
        this.latest_mes;
    }
    upt_latest_mes(){
        var elm = document.getElementsByClassName("main_mes");
        this.latest_mes = elm[elm.length - 1];
    }
    appendtext(text, time){
        var p_elm = document.createElement("p");
        p_elm.textContent = text;
        this.latest_mes.getElementsByClassName("message")[0].appendChild(p_elm);
        this.latest_mes.getElementsByClassName("time")[0].textContent = this.Time_TimeSTR(time);
    }
    NoNew(id, time){
        let boolean_ret = true;
        //latest_mesが無ければfalse
        if(!this.latest_mes){
            return false;
        }
        //ID
        if(!(this.latest_mes.classList.contains(id))){
            boolean_ret = false;
            return boolean_ret;
        }
        //時間
        var time_elm_STR = this.latest_mes.getElementsByClassName("time")[0].textContent;
        var time_elm_time = this.TimeSTR_Time(time_elm_STR);
        var time_elm_min = time_elm_time[0] * 60 + time_elm_time[1];
        var time_min = time[0] * 60 + time[1];
        if(!(Math.abs(time_elm_min - time_min) <= this.THR_MINTIME))
            {
                boolean_ret = false;
                return boolean_ret;
            }
        return boolean_ret;
    }
    Time_TimeSTR(time_H_M){
        let time_m_STR = "" + time_H_M[1];
        if(time_H_M[1] < 10){
            time_m_STR = "0" + time_H_M[1];
        }
        let timeSTR = time_H_M[0]+":"+time_m_STR;
        return timeSTR;
    }
    TimeSTR_Time(timeSTR){
        let time_H_M = timeSTR.split(":");
        time_H_M[0] = parseInt(time_H_M[0]);
        time_H_M[1] = parseInt(time_H_M[1]);
        return time_H_M;
    }
    Time_add(time, add_mintime){
        const min = 60;
        const hour = 24;
        var time_H_M = [parseInt(time[0]),parseInt(time[1])];
        time_H_M[1] += add_mintime;
        if(time_H_M[1] >= min){
            time_H_M[1] -= min;
            time_H_M[0] += 1;
        }
        if(time_H_M[0] >= hour){
            time_H_M = 0;
        }
        return time_H_M;
    }
    create_date_elm(DaySTR){
        let div = document.createElement("div");
        let span = document.createElement("span");
        div.classList.add(DaySTR);
        div.classList.add("date");
        span.textContent = DaySTR;
        div.appendChild(span);
        return div;
    }
    ScrollBottom(){
        var elm = document.getElementsByClassName("body")[0];
        elm.scrollTop = elm.scrollHeight;
    }
    isBottom(){
        var elm = document.getElementsByClassName("body")[0];
        return elm.scrollHeight == elm.scrollTop + elm.offsetHeight;
    }
    /* スクロールボタン */
    ScrollBottomEvent(){
        document.getElementsByClassName("body")[0].addEventListener('scroll', function(event){
            var late_button_elm = document.getElementById("late")
            if(BODY.isBottom()){
                late_button_elm.classList.remove("hide_1");
                late_button_elm.classList.add("hide_0");
            }else{
                late_button_elm.classList.remove("hide_0");
                late_button_elm.classList.add("hide_1");
            }
        });
    }
    ScrollBottomAction(){
        this.ScrollBottom();
    }
    re_icon(){
        let message_list = document.getElementsByClassName("body")[0].getElementsByClassName("main_mes");
        if(this.latest_mes){
            let add_str = this.latest_mes.getElementsByClassName("message")[0].classList[0];
            for(let message of message_list){
                var icon_img = message.getElementsByClassName("icon")[0].getElementsByTagName("img")[0];
                if(/\?new=/.test(icon_img.src)){
                    icon_img.src.split("?new=")[0];
                }else{
                    icon_img.src = icon_img.src + "?new=" + add_str;
                }
            }
        }
    }
}