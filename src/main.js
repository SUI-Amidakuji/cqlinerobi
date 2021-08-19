const BODY  = new Meta_body();
const FOOT  = new foot();
const METAM = new metamorphose();
const LOGIN = new login();

let Interval = 3000; //3000ms
let ChibiquestURL = "";

let TimeInterval;

const PicturePath = "PictureCache"

const SERVER_ID = {
    sun : "sun",
    moon: "moon",
    mars: "mars",
    earth: "earth"
};
const SERVER_NUMBERS = {
    sun : 1,
    moon: 2,
    mars: 3,
    earth: 4
};

function load(){
    BODY.upt_latest_mes();
    BODY.ScrollBottomEvent();
    BODY.ScrollBottom();
    FOOT.upt_foot_elm();
    FOOT.upt_foot_input();
    LOGIN.setElement();

    /*ELECTRON-START*/
    //右クリックメニュー
    const template_default = [
        {role: 'copy', accelerator: 'CmdOrCtrl+C'},
        { type: 'separator' },
        {role: 'selectAll', accelerator: 'CmdOrCtrl+A'},
    ]
    const template_textarea = [
        {role: 'undo', accelerator: 'CmdOrCtrl+Z'},
        {role: 'redo', accelerator: 'CmdOrCtrl+Y'},
        { type: 'separator' },
        {role: 'cut', accelerator: 'CmdOrCtrl+X'},
        {role: 'copy', accelerator: 'CmdOrCtrl+C'},
        {role: 'paste', accelerator: 'CmdOrCtrl+V'},
        { type: 'separator' },
        {role: 'selectAll', accelerator: 'CmdOrCtrl+A'},
    ]
    for(elm of document.getElementsByClassName("LOGIN")[0].getElementsByTagName("input")){
        elm.oncontextmenu = () => {
            window.api.show_context_menu(template_textarea);
        }
    }
    for(elm of document.getElementsByClassName("LOGIN")[0].getElementsByTagName("textarea")){
        elm.oncontextmenu = () => {
            window.api.show_context_menu(template_textarea);
        }
    }
    document.getElementsByClassName("head")[0].oncontextmenu = () => {
        window.api.show_context_menu(template_default);
    }
    document.getElementsByClassName("body")[0].getElementsByClassName("context_menu_background")[0].oncontextmenu = () => {
        window.api.show_context_menu(template_default);
    }
    document.getElementsByClassName("foot")[0].oncontextmenu = () => {
        window.api.show_context_menu(template_textarea);
    }
    var message_elms = document.getElementsByClassName("body")[0].getElementsByClassName("content")[0].getElementsByClassName("message");
    //コピー
    for(elm of message_elms){
        p_elms = elm.getElementsByTagName("p");
        let Message_Text = "";
        for(p_elm of p_elms){
            Message_Text += p_elm.textContent;
            Message_Text += "\n";
        }
        elm.oncontextmenu = () => {
            window.api.show_context_menu_message(Message_Text);
        }
    }
    Server_Icon_Download();
    /*ELECTRON-END*/

}
/*ELECTRON-START*/
//右クリックアクション
window.api.on('context_menu',(event, arg)=>{
    switch (arg["id"]) {
        default:
            break;
    }
});
//透明度
function OpacityUpdate(Opacity_elm){
    window.api.Opacity(parseInt(Opacity_elm.value));
}
//最小化
function Minimize(){
    window.api.minimize();
}
//最前面
function Pin(Pin_elm){
    window.api.OnTop(Pin_elm.checked);
}
//閉じる
function Close(){
    window.api.close();
}
//通知
function Notice(title_str, body_str, Click_func){
    if(document.getElementById("notice").checked){
        new Notification(title_str, { body: body_str })
        .onclick = Click_func;
    }
}
//画像ダウンロード
function download(url, file_name){
    window.api.PictDownload(url, "http://bt.chibiquest.net/", file_name);
}
//ユーザー画像ダウンロード
function User_Pict_Download(id, server_number){
    let UserPictUrl;
    if(server_number == 1){
        UserPictUrl = "http://i.chibiquest.net/img/uimg/" + id + ".gif"
    }else{
        UserPictUrl = "http://i" + server_number + ".chibiquest.net/img/uimg/" + id + ".gif"
    }
    let FileName = PicturePath + "/" + server_number + "_" + id + ".gif"
    window.api.file_exists(FileName).then(
        (data) => {
            if(!data.exists){
                console.log("Download: " + data.file_path);
                download(UserPictUrl, data.file_path);
            }
        }
    )
}
//サーバーアイコンダウンロード
function Server_Icon_Download(){
    function SvIconDL(server_number){
        window.api.file_exists(PicturePath + "/" + "sv" + server_number +".gif").then(
            (data)=>{
                //ファイル存在しないとき
                if(!data.exists){
                    console.log("Download: " + data.file_path);
                    download("http://bt.chibiquest.net/img/sv/"+ server_number +".gif", data.file_path);
                }
            }
        )
    }
    SvIconDL(1);
    SvIconDL(2);
    SvIconDL(3);
    SvIconDL(4);
}
/*ELECTRON-END*/

//URLセット
function login_on(){
    setChibiquestURL(LOGIN.getUserID(), LOGIN.getUserSID(), SERVER_NUMBERS[LOGIN.getUserServer()]);
    resetTimer();
    MetamorphoseAdditionalMessage(ChibiquestURL + "&com=1&com2=chat")
}
function setChibiquestURL(id, sid, sv_no){
    ChibiquestURL = "http://bt.chibiquest.net/cqmain.php?num=" +id+ "&sid=" +sid+ "&sv_no=" +sv_no;
}
//文字数カウント
function Update_Mojisu(){
    FOOT.Mojisu_Counter_Update(FOOT.count_StringByte());
}
//タイマーリセット
function resetTimer(){
    if(TimeInterval){
        clearInterval(TimeInterval);
    }
    TimeInterval = setInterval(
        () => {
            MetamorphoseAdditionalMessage(ChibiquestURL + "&com=1&com2=chat")
        },
        Interval
    );
}
//メッセージ送信
function Submit_Message(KeyCode){
    const ENTER = 13;
    if(KeyCode === ENTER){
        if(MessageByteCheck()){
            let bunsho = FOOT.getSend_Message();
            MetamorphoseAdditionalMessage(ChibiquestURL + "&com=1&com2=chat" + "&bun=" + bunsho);
            resetTimer();
            FOOT.setSend_Message("");
        }
    }
}
//文字数チェック
function MessageByteCheck(){
    let check = FOOT.isStringByte_Satisfy()
    FOOT.StringByte_Message(check);
    return check;
}
//チビクエストとのやり取り
function MetamorphoseAdditionalMessage(url){
    console.log("open:" + url);
    //画像更新(内部)
    BODY.re_icon()
    METAM.meta_bgw(url, (MetamorphoseValue) => {
        newMetamorphoseValue = METAM.簡易メッセージ同期(MetamorphoseValue);
        for(let i = newMetamorphoseValue.length -1; i >= 0; i--){
            var data = newMetamorphoseValue[i];
            User_Pict_Download(data.id, SERVER_NUMBERS[data.server_number]);
            AppendMessage(
                SERVER_ID[data.server_number],
                data.color_code,
                data.id,
                data.name,
                he.decode(data.message,{
                    isAttributeValue : true
                }),
                data.date,
                data.time
            )
        }
        if(newMetamorphoseValue[0]){//追加メッセージがあった場合
            METAM.set_latest_MetamorphoseValue(newMetamorphoseValue[0]);
            var data = newMetamorphoseValue[0];
            Notice(
                data.name,
                he.decode(data.message,{
                    isAttributeValue : true
                    }),
                ()=>{})//通知
        }
    })
}
//メッセージとして追加する
function AppendMessage(server, color_code, id_left, name, text, day_Month_Date, time_H_M){
    let id = id_left;
    if(id_left == LOGIN.getUserID()){
        id = "my";
    }
    var content_elm = document.getElementsByClassName("content")[0]
    let Bottom_flag = BODY.isBottom();

    date = new Date();
    if(time_H_M){
        date.setHours(time_H_M[0]);
        date.setMinutes(time_H_M[1]);
    }
    if(day_Month_Date){
        date.setMonth(day_Month_Date[0]);
        date.setDate(day_Month_Date[1]);
    }
    time = [date.getHours(), date.getMinutes()]
    day = [date.getMonth(), date.getDate(), date.getDay()]
    let add_string = day[0] + "." + day[1] + "(" + ["日", "月", "火", "水", "木", "金", "土" ][day[2]] + ")"

    var date_elm = content_elm.getElementsByClassName("date");
    date_elm = date_elm[date_elm.length - 1];
    //例外： なにもない とき
    if(!date_elm){
        content_elm.appendChild(BODY.create_date_elm(add_string));
        var date_elm = content_elm.getElementsByClassName("date");
        date_elm = date_elm[date_elm.length - 1];
    }
    let date_class = date_elm.classList[0];

    //日にちを跨いだ場合
    if(date_class != add_string){
        content_elm.appendChild(BODY.create_date_elm(add_string));
        var date_elm = content_elm.getElementsByClassName("date");
        date_elm = date_elm[date_elm.length - 1];
    }
    //================
    //ID サーバー 日時分が一致すれば、くっつける
    if(BODY.NoNew(id, time) && BODY.NoNew_Server(SERVER_ID[server]) && date_class == add_string){
        BODY.appendtext(text, time);
    }else{
        var user_icon_path = "../../../" + PicturePath + "/" + SERVER_NUMBERS[server] + "_" + id_left + ".gif";
        mes = new Meta_Main_Mes(server, color_code, id, name, BODY.Time_TimeSTR(time), user_icon_path);
        mes.appendmessage(text);
        mes.right_menu(text);
        date_elm.appendChild(mes.packing());
    }
    BODY.upt_latest_mes();
    if(Bottom_flag){
        BODY.ScrollBottom();
    }
}