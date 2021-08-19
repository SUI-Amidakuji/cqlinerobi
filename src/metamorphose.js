
class metamorphose{
    constructor(url){
        this.latest_MetamorphoseValue;
        this.request = new XMLHttpRequest();
        this.url = url
        this.SERVER_VALUE = {
            "sun"  : 1,
            "moon" : 2,
            "mars" : 3,
            "earth": 4
        };
        this.SERVER_STRING = [null, "sun", "moon", "mars", "earth"];
    }
    meta_bgw(url, AddMessageFunc){
        let response = window.api.fetch_req(url);
        response.then( (html_text) => {
            let bgw_text = html_text.split('<div class="bgw">')[1];
            let Cutted_text = this.CakeCut(bgw_text);
            let Piece_list = this.PreparePieceOfCake(Cutted_text);
            const MetamorphoseValue = this.ArrangementOfCutCake(Piece_list);

            AddMessageFunc(MetamorphoseValue);
        });
    }
    ArrangementOfCutCake(Piece_list){
        let ret_Cake = [];
        for(let data of Piece_list){
            let server_number =this.server_number_Arrangement(data.server_number);
            let id = this.id_Arrangement(server_number, data.id);
            let message = this.message_Arrangement(data.message);
            let color = this.color_Arrangement(data.color_and_name);
            let name = this.name_Arrangement(data.color_and_name);
            let date = this.date_Arrangement(data.time);
            let time = this.time_Arrangement(data.time);
            ret_Cake.push(
                {
                    server_number   :   this.SERVER_STRING[parseInt(server_number)],
                    id              :   id,
                    color_code      :   color,
                    name            :   name,
                    message         :   message,
                    date    :   [parseInt(date[0]), parseInt(date[1])],
                    time    :   [parseInt(time[0]), parseInt(time[1])]
                }
            );
        }
        return ret_Cake;
    }
    server_number_Arrangement(server_number_text){
        return server_number_text.split("'img/sv/")[1].split(".gif'")[0]
    }
    id_Arrangement(server_number_str, id_text){
        return id_text.split("bnum2="+server_number_str+"-")[1].split("&num=")[0]
    }
    message_Arrangement(message_text){
        return message_text.split("</font></a>:")[1].split("  <span class='about'>")[0]
    }
    color_Arrangement(color_and_name_text){
        return color_and_name_text.split("<font color=")[1].split(">")[0]
    }
    name_Arrangement(color_and_name_text){
        return color_and_name_text.split(">")[1].split("</font")[0]
    }
    date_Arrangement(time){
        let date = ["", ""];
        date[0] = time.split("<span class='about'>")[1].split("/")[0];
        date[1] = time.split("/")[1].split(" ")[0];
        return date;
    }
    time_Arrangement(time){
        let times = ["", ""];
        times[0] = time.split(" ")[2].split(":")[0];
        times[1] = time.split("<\/span>")[0].split(":")[1]
        return times;
    }
    PreparePieceOfCake(CutCake_data){
        let PieceOfCake = [];
        for(let i=0; i < CutCake_data.server_number.length; i++){
            var Piece = {
                server_number   :   CutCake_data.server_number[i],
                id              :   CutCake_data.id[i],
                message         :   CutCake_data.message[i],
                color_and_name  :   CutCake_data.color_and_name[i],
                time    :   CutCake_data.time[i],
            }
            PieceOfCake.push(Piece);
        }
        return PieceOfCake;
    }
    CakeCut(bgw_text){
        let data = {
            server_number   : bgw_text.match(/<img src='img\/sv\/.[.]gif'>/gm),
            id              : bgw_text.match(/<a href=bsta.php\?bnum2=.-.*&num=/gm),
            message         : bgw_text.match(/<\/font><\/a>:.*  <span class='about'>/gm),
            color_and_name  : bgw_text.match(/<font color=#......>.*<\/font>/gm),
            time  : bgw_text.match(/<span class='about'>.*<\/span>/gm)
        }
        return data;
    }
    set_latest_MetamorphoseValue(latest_MetamorphoseValue){
        this.latest_MetamorphoseValue = latest_MetamorphoseValue
    }
    get_latest_MetamorphoseValue(){
        return this.latest_MetamorphoseValue;
    }

    簡易メッセージ同期(三十個のMetamorphoseValue){
        if(!this.latest_MetamorphoseValue){
            return 三十個のMetamorphoseValue;
        }
        let 返答する追加予定のMetamorphoseValueリスト;
        let 最新のMetamorphoseValue = this.latest_MetamorphoseValue;
        let 既に保持されたメッセージの最新インデックス = this.最初から複数のメッセージを検索(三十個のMetamorphoseValue, 最新のMetamorphoseValue);

        /*ここを変更して完全なメッセージ同期にしたい*/
        if(!既に保持されたメッセージの最新インデックス){
            既に保持されたメッセージの最新インデックス = [0];
        }
        既に保持されたメッセージの最新インデックス = 既に保持されたメッセージの最新インデックス[既に保持されたメッセージの最新インデックス.length - 1];
        /* === */
        返答する追加予定のMetamorphoseValueリスト = 三十個のMetamorphoseValue.slice(0, 既に保持されたメッセージの最新インデックス);
        return 返答する追加予定のMetamorphoseValueリスト;
    }
    最初から複数のメッセージを検索(三十個のメッセージリスト, 検索するメッセージ){
        let 検索に当てはまるメッセージインデックス = [];
        let i=0;
        for(let data of 三十個のメッセージリスト){
            if(this.ふたつのメッセージ内容が同じである場合(data, 検索するメッセージ)){
                検索に当てはまるメッセージインデックス.push(i);
            }
            i+=1;
        }
        return 検索に当てはまるメッセージインデックス;
    }
    ふたつのメッセージ内容が同じである場合(一メッセージ, 二メッセージ){
        let ret_boolean = true;
        for(let key in 一メッセージ){
            if(!二メッセージ[key]){
                ret_boolean = false
                break;
            }
            if(key == "date" || key == "time"){
                if(一メッセージ[key][0] != 二メッセージ[key][0]){
                    ret_boolean = false
                }
                if(一メッセージ[key][1] != 二メッセージ[key][1]){
                    ret_boolean = false
                }
                break;
            }
            if(一メッセージ[key] != 二メッセージ[key]){
                ret_boolean = false
            }
        }
        return ret_boolean;
    }
}

class Meta_Main_Mes extends Main_Mes{
    constructor(server, color_code, id, names, timeSTR, image_url){
        super(id, names, timeSTR, image_url);
        this.server = server;
        this.color = color_code;
    }
    name_elm(){
        let elm = document.createElement("div");
        elm.classList.add("name");
        elm.classList.add("icon_server");
        elm.classList.add(this.server);
        elm.style = "color: " + this.color;
        elm.textContent = this.names;
        return elm;
    }
}

class Meta_body extends body{
    NoNew_Server(server){
        return this.latest_mes.getElementsByClassName("icon_server")[0].classList.contains(server);
    }
}