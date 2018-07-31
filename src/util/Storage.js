export default class Storage {
    static updateSavedGame(value) {
        window.localStorage.setItem("starLordSavedGame", JSON.stringify(value));
    }

    static getSavedGame() {
        return JSON.parse(window.localStorage.getItem("starLordSavedGame"));
    }

    static openLevel(world, level) {
        let savedGame = Storage.getSavedGame() ? Storage.getSavedGame() :
                        {"World 1": {"openLevels": {"Level 1": {}}}};
        savedGame[world].openLevels[level] = {"cleared": "true"};
        Storage.updateSavedGame(savedGame);
    }

    static remove(key) {
        window.localStorage.removeItem(key);
    }
}
