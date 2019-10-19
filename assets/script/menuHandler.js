// Handles DOM menus, updates on game state
class MenuHandler{
    constructor(menus, activeMenu){
        this.menus = menus;
        this.activeMenu = this.menus[activeMenu]; 
    
    }
    changeState(state){
        // Need some kind of state to menu mapping, or just use strings.
        this.activeMenu.style.display = "none";
        this.menus[state].style.display = "flex";
        this.activeMenu = this.menus[state];
    }
}