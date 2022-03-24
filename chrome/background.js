// bookmark作成のシナリオ
// - 
// - 

// type Bookmark {
//    dateAdded: 1648105202399
//    id: "112"
//    index: 8
//    parentId: "74"
//    title: "Qiita"
//    url: "https://qiita.com/"
// }
//
// type MoveInfo {
//     index: number,
//     oldIndex: number,
//     oldParentId: string,
//     parentId: string
// }

const TSUNDOKU_FOLDER_NAME = "tsundoku"
chrome.runtime.onInstalled.addListener(async () => {
    // 積読フォルダがない場合、新規作成
    // "Other Bookmarks"フォルダ直下に、"tsundoku"フォルダを作成する
    const folder_results = await chrome.bookmarks.search({
        title: TSUNDOKU_FOLDER_NAME,
    })
    if (folder_results && (folder_results.length == 0)) {
        console.error(`bookmark folder (${TSUNDOKU_FOLDER_NAME}) does not exist`);
        return;
    }

    
    // 積読フォルダのNodeを取得
    const tsundoku_folder = folder_results[0];


    // bookmarkが削除時に発火
    chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
        if (removeInfo.parentId == tsundoku_folder.id) {
            // 積読フォルダからbookmarkが削除される場合
            console.log('DELETE: ', removeInfo.node.title);
        }

    });

    // bookmark作成時に発火
    chrome.bookmarks.onCreated.addListener((id, bookmark) => {
        if (bookmark.parentId == tsundoku_folder.id) {
            // 積読フォルダにbookmarkが新規作成される場合
            console.log('CREATE: ', bookmark.title);
        }
    });

    // bookmarkのフォルダ移動時に発火
    chrome.bookmarks.onMoved.addListener(async (id, moveInfo) => {
        const results = await chrome.bookmarks.get(id);
        const bookmark = results[0];

        if (moveInfo.oldParentId == tsundoku_folder.id) {
            // 積読フォルダからbookmarkが移動される場合
            console.log('REMOVE: ', bookmark.title)
        } else if (moveInfo.parentId == tsundoku_folder.id) {
            // 積読フォルダにbookmarkが追加される場合
            console.log('MOVE ADD: ', bookmark.title)
        }
    })
});
