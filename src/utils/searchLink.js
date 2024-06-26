export function searchLinkInText(text){
    const regExp = /\[link="(.*?)"\|\((.*?)\)\]/;
    const matchLink = text.match(regExp, '$1 $2')


   


    if(matchLink?.length > 0){
        const link = matchLink[1];
        const title = matchLink[2];
        return text.replace(/\[link="(.*?)"\|\((.*?)\)\]/g, `<a target="__blank" title="${link}" href="${link}">${title}</a>`);
    }

    
    return text;
}

export function mapLinkDeafultText(text){
    const regExp = /\[link="(.*?)"\|\((.*?)\)\]/;
    const matchLink = text.match(regExp, '$1 $2')



    if(matchLink?.length > 0){
        const title = matchLink[2];
        return text.replace(/\[link="(.*?)"\|\((.*?)\)\]/g, `${title}`);
    }
    


    return text;
}
