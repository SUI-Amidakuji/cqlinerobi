class login{
    constructor(){
        this.ID_elm;
        this.SID_elm;
        this.SERVER_elm;
        this.URL_ID_elm;
    }
    setElement(){
        let login_elm = document.getElementsByClassName("LOGIN")[0];
        this.ID_elm = login_elm.getElementsByClassName("ID")[0];
        this.SID_elm = login_elm.getElementsByClassName("SID")[0];
        this.SERVER_elm = login_elm.getElementsByClassName("SERVER")[0];
        this.URL_ID_elm = login_elm.getElementsByClassName("URL_ID")[0];
    }
    URL_SHOW_LOGIN(check_elm){
        let boolean = check_elm.checked;
        if(boolean){
            this.ID_elm.classList.add("hidden");
            this.SID_elm.classList.add("hidden");
            this.SERVER_elm.classList.add("hidden");
            this.URL_ID_elm.classList.remove("hidden");
        }else{
            this.ID_elm.classList.remove("hidden");
            this.SID_elm.classList.remove("hidden");
            this.SERVER_elm.classList.remove("hidden");
            this.URL_ID_elm.classList.add("hidden");
        }
    }
    Open(){
        let login_elm = document.getElementsByClassName("LOGIN")[0];
        login_elm.classList.add("hidden");
    }
    Close(){
        let login_elm = document.getElementsByClassName("LOGIN")[0];
        login_elm.classList.add("hidden");
    }
    getUserID(){
        return this.ID_elm.getElementsByTagName("input")[0].value;
    }
    getUserSID(){
        return this.SID_elm.getElementsByTagName("input")[0].value;
    }
    getUserServer(){
        return this.SERVER_elm.getElementsByTagName("select")[0].value;
    }
    URLID_ID(){
        let URL_str = this.URL_ID_elm.getElementsByTagName("textarea")[0].value;
        let ID   = URL_str.split("num=")[1].split("&")[0];
        let SID  = URL_str.split("sid=")[1].split("&")[0];
        let SVNO = URL_str.split("sv_no=")[1][0];
        this.ID_elm.getElementsByTagName("input")[0].value = ID;
        this.SID_elm.getElementsByTagName("input")[0].value = SID;
        this.SERVER_elm.getElementsByTagName("select")[0].options[parseInt(SVNO) - 1].selected = true;
    }
}
