'use strict';

{
  const timer = document.getElementById('timer');
  const start = document.getElementById('start');
  const goal = document.getElementById('goal');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');
  const result = document.getElementById('result-container');
  const record = document.getElementById('record');
  const save = document.getElementById('save');

  let startTime;
  let timeoutId;
  let goalNo = 1;

  //--------------------------------------------------------------------
  // 0.01秒毎にタイムを更新
  //--------------------------------------------------------------------
  function countUp() {
    const d = new Date(Date.now() - startTime);
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    const ms = String(d.getMilliseconds()).padStart(3, '0').slice(0, 2);
    timer.textContent = `${m}:${s}.${ms}`;

    timeoutId = setTimeout(() => {
      countUp();
    }, 10);
  }
  //--------------------------------------------------------------------
  // レコード有無チェック
  //--------------------------------------------------------------------
  function recordExistCheck() {
    let cnt = 0;
    for (let i = 0; i < localStorage.length; i++) {
      // 2023年…の頭20でない時はストップウォッチのキーでないので除外
      if (String(localStorage.key(i)).slice(0, 2) !== '20') {
        continue;
      }
      cnt++;
    }
    return cnt;
  }
  //--------------------------------------------------------------------
  // 初期画面のボタン表示
  //--------------------------------------------------------------------
  function setButtonStateInitial() {
    start.classList.remove('inactive');
    goal.classList.add('inactive');
    stop.classList.add('inactive');
    reset.classList.add('inactive');
    // ローカルストレージ無しの時は表示しない
    if (recordExistCheck() === 0) {
      record.classList.add('dnone');
    } else {
      record.classList.remove('dnone');
    }
    save.classList.add('dnone');
  }
  //--------------------------------------------------------------------
  // カウント中のボタン表示
  //--------------------------------------------------------------------
  function setButtonStateRunning() {
    start.classList.add('inactive');
    goal.classList.remove('inactive');
    stop.classList.remove('inactive');
    reset.classList.add('inactive');
    record.classList.add('dnone');
    save.classList.add('dnone');
  }
  //--------------------------------------------------------------------
  // 停止中のボタン表示
  //--------------------------------------------------------------------
  function setButtonStateStoped() {
    start.classList.add('inactive');
    goal.classList.add('inactive');
    stop.classList.add('inactive');
    reset.classList.remove('inactive');
    record.classList.add('dnone');
    // GOALが1件も無い場合ボタンは表示しない
    if (result.childElementCount !== 0) {
      save.classList.remove('dnone');
    }
  }
  //--------------------------------------------------------------------
  // STARTボタン押下
  //--------------------------------------------------------------------
  start.addEventListener('click', () => {
    if (start.classList.contains('inactive') === true) {
      return;
    }
    setButtonStateRunning();  // ボタンの有効/無効制御
    startTime = Date.now();   // 開始時間を保存
    countUp();                // 0.01秒毎にカウント
    startAudio.play();        // START音声開始
  });
  //--------------------------------------------------------------------
  // GOALボタン押下
  //--------------------------------------------------------------------
  goal.addEventListener('click', () => {
    if (goal.classList.contains('inactive') === true) {
      return;
    }
    const divLast = document.createElement('div');    // タイムを表示するためのタグ生成
    result.appendChild(divLast);                      // divタグを追加
    divLast.textContent = `${goalNo}.　` + timer.textContent;          // 現タイムを設定
    goalNo++;                                         // GOALtimeカウントアップ
    divLast.classList.add('time-disp');               // 結果タイムの装飾
    startAudio.pause();                               // START音声停止
    goalAudio.currentTime = 0;                        // 連打しても先頭から再生
    goalAudio.play();                                 // GOAL音声開始
    window.scroll(0, result.childElementCount * 69 + 200);  // 一番下までスクロール
  });
  //--------------------------------------------------------------------
  // STOPボタン押下
  //--------------------------------------------------------------------
  stop.addEventListener('click', () => {
    if (stop.classList.contains('inactive') === true) {
      return;
    }
    setButtonStateStoped();                     // ボタンの有効/無効制御
    clearTimeout(timeoutId);                    // タイマ停止
    startAudio.pause();                         // START音声停止
    goalAudio.pause();                          // GOAL音声停止
  });
  //--------------------------------------------------------------------
  // RESETボタン押下
  //--------------------------------------------------------------------
  reset.addEventListener('click', () => {
    if (reset.classList.contains('inactive') === true) {
      return;
    }
    window.location.href = 'index.html';     // 初期画面に遷移
  });
  //--------------------------------------------------------------------
  // SAVEボタン押下
  //--------------------------------------------------------------------
  save.addEventListener('click', () => {
    if (result.childElementCount !== 0) {
      let keyName;
      let str = '';

      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      let hour = today.getHours();
      let min = today.getMinutes();
      let sec = today.getSeconds();

      keyName = year + '年' + month + '月' + day + '日' + hour + '時' + String(min).padStart(2, '0') + '分' + String(sec).padStart(2, '0') + '秒';

      // 記録を抽出
      for (let i = 0; i < result.childElementCount; i++) {
        str += result.children[i].textContent;
      }
      // ローカルストレージに記録を保存
      localStorage.setItem(keyName, str);
      // ボタンを消す
      save.classList.add('dnone');
    }
  });
  //--------------------------------------------------------------------
  // 初回処理
  //--------------------------------------------------------------------

  // 初期画面のボタン有効/無効制御
  setButtonStateInitial();

  // START/GOAL音声のインスタンス作成
  let startAudio = new Audio("audio/start.mp3");
  let goalAudio = new Audio("audio/goal.mp3");


}