async function wait(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
let length = 100;
const lyricsElement = document.getElementById("lyrics");

let lyrics = `This　is　fate　with　you　　　　　Hello　Mellow　甘い果汁　　　　　この痛みも　　　　　　　　　　今年味を求めている　　　　　　　　　　
                  アツアツ　　　　 解け焦げた砂糖　　　　　　　のような硬い表情　　　　 甘党と葛藤繰り返してる　　　　　　　　　　　 TEL...　　　　　　　　　雨模様の放課後　　　　　　　　　　　「こんなのはどうだろう」　　　　悪戯に微笑む
　　　　　　　　　　　ふわって　　　　　　　　尼そぎが風に揺れる　　　　　まだ僕ら孤独な過去に生きてる　　　　　小賢しさも執念深さも片がつく　　　　　あの星を目指した！
　　　　　　　いつかまた心から笑える日々が訪れても　　　　光も闇もないよ　　　　　　表も裏でも君だよ　　　　　　　　　　　　　　　　　　上目遣いの？が高尚　　　　Limited Edition　　　今が最高、という一瞬がある　　　　　　　　　幼いガール　　　　　　　　雪溶けに香る　　　　　　　　　　静かに燃えるようはブランデー　　　　
悲しみはどこから来る　　　　　　　まだ今は狐狼の心を持つ　　　　　　　　暗い朝と光る夜でも繰り返す　　　　　　この星を選んだのも僕らだった　　　　　　　　　　　　　涙拭けば窓から差し込む夕日　　　　　諦めれば楽なのにまたそれが苦しいから　　　　むすんだんだ　　　　　言葉だけじゃどうも不安で　　　　不安定　　僕はただ掌で踊る　　　　甘曽木が風に揺れる　　　　　　　まだ僕ら孤独な過去に生きてる　　　　小賢しさも執念深さも平らげる　　　　　あの星を掴み取る！　　　　　　いつかまた心から笑える日々が訪れても　　　　　痛みも病みもないよ　　　　　　この手を離してあげるよ　　　　　　　　光るも闇もないよ　　　　　表も裏でも君だよ　　　　　　　君は　　　　　　　　　君だけだよ`;
let ee = `　　　　　　　　　　　　　　　　　　　　　　`;
let defau = `　　　　　　　　　　　　　　　　　　　　　　`;
let i = 0;
async function slider(){
    for(let i = 0; i < lyrics.length; i++){
        ee = ee.slice(1)

        ee+=lyrics[i];

        lyricsElement.textContent=ee
        await wait(length)
        if(i == lyrics.length-1){
            for(let j = 0; j< defau.length; j++){
                ee = ee.slice(1);
                ee+=defau[j];
                lyricsElement.textContent=ee
                await wait(length);
            }
            slider();
        }
    }
    

}
slider()
