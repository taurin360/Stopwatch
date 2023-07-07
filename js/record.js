'use strict';

{
  const result = document.getElementById('result-container');
  const record = document.getElementById('record-container');
  const backTop = document.getElementById('back-top');
  const backMenu = document.getElementById('back-menu');
  const controls = document.getElementById('controls')
  const fileOut = document.getElementById('file-output');
  const elase = document.getElementById('elase');
  let timeKey = [];

  // -------------------------------------------------------------
  // 初回処理
  // -------------------------------------------------------------
  for (let i = 0; i < localStorage.length; i++) {
    // 2023年…の頭20でない時はストップウォッチのキーでないので除外
    if (String(localStorage.key(i)).slice(0, 2) !== '20') {
      continue;
    }
    timeKey[i] = localStorage.key(i);
  }

  // レコード無しの時はストップウォッチ画面に戻る
  if (timeKey.length === 0) {
    window.location.href = '../index.html';
  }

  // 一旦ソートをかける
  timeKey.sort();

  for (let i = 0; i < timeKey.length; i++) {
    const list = document.createElement('div');
    result.appendChild(list);
    list.textContent = timeKey[i];
  }
  // -------------------------------------------------------------
  // 押された時刻のレコードを表示
  // -------------------------------------------------------------
  result.addEventListener('click', e => {
    const time = localStorage.getItem(e.target.textContent);

    // 先頭にレコード取得日時を表示
    const rec = document.createElement('div');
    record.appendChild(rec);
    rec.textContent = e.target.textContent;

    let i = 0;
    let str = '';
    do {
      if (i < 11 * 9) {
        str = String(time).slice(i, i + 11);
        i += 11;
      } else {
        str = String(time).slice(i, i + 12);
        i += 12;
      }
      const rec = document.createElement('div');
      record.appendChild(rec);
      rec.textContent = str;

    } while (i < String(time).length);

    result.classList.add('dnone');
    record.classList.remove('dnone');
    controls.classList.remove('dnone');
    backTop.classList.add('dnone');
    backMenu.classList.remove('dnone');

  });
  // -------------------------------------------------------------
  // レコードをテキストファイル出力
  // -------------------------------------------------------------
  fileOut.addEventListener('click', () => {

    let str = '';
    let filename;

    filename = record.children[0].textContent + '.txt';  // ファイル名
    for (let i = 1; i < record.childElementCount; i++) {
      str += '++++++++++++++++++++++++++++\r\n'
      str += record.children[i].textContent + '\r\n';
    }
    str += '++++++++++++++++++++++++++++\r\n'

    let ary = str.split(''); // 配列形式に変換（後述のBlobで全要素出力）
    let blob = new Blob(ary, { type: "text/plan" }); // テキスト形式でBlob定義
    let link = document.createElement('a'); // HTMLのaタグを作成
    link.href = URL.createObjectURL(blob); // aタグのhref属性を作成
    link.download = filename; // aタグのdownload属性を作成
    link.click(); // 定義したaタグをクリック（実行）
  });
  // -------------------------------------------------------------
  // レコードを削除
  // -------------------------------------------------------------
  elase.addEventListener('click', () => {
    // 日付のキーでローカルストレージ削除
    localStorage.removeItem(record.children[0].textContent);
    // メニュー画面に遷移
    window.location.href = 'record.html';
  });

}


