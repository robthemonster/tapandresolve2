export const SETS_BY_CATEGORY = {"core":["m19","ori","m15","m14","m13","m12","m11","m10","10e","9ed","8ed","7ed","6ed","5ed","4ed","sum","3ed","2ed","leb","lea"],"commander":["c18","cm2","c17","cma","c16","c15","c14","c13","cm1","cmd"],"duel_deck":["gs1","ddu","ddt","dds","ddr","ddq","ddp","ddo","evg","jvc","dvd","gvl","ddn","ddm","ddl","ddk","ddj","ddi","ddh","td2","ddg","ddf","dde","ddd","ddc","dd2","dd1"],"draft_innovation":["bbd","cn2","cns"],"promo":["prw2","prna","pf19","pgrn","prwk","ps18","pm19","pss3","pbbd","pdom","plny","pnat","prix","j18","pust","pxln","pss2","ps17","phou","pakh","paer","f17","j17","ps16","pkld","pemn","psoi","pogw","j16","f16","pss1","pbfz","pori","ptkdf","pdtk","pfrf","ugin","j15","f15","pktk","pm15","ps14","pjou","pbng","pdp14","pi14","f14","j14","pths","pm14","psdc","pdgm","pwcq","pgtc","pdp13","pi13","f13","j13","prtr","pm13","pavr","pdka","pidw","pwp12","pdp12","j12","f12","pisd","pm12","pnph","pmbs","pdp11","pwp11","g11","f11","p11","psom","pm11","proe","pwwk","pdp10","pwp10","p10","g10","f10","pzen","phop","pm10","purl","pbok","pwp09","pdtp","g09","p09","f09","pwpn","p15a","plpa","pg08","g08","f08","p08","psum","p10e","pgpx","ppro","pres","pg07","p07","f07","g07","pcmp","pal06","pjas","f06","g06","pgtw","p06","p2hg","pal05","pjse","f05","p05","g05","pal04","p04","f04","g04","prel","pal03","f03","p03","g03","prm","pal02","f02","pr2","g02","pal01","g01","f01","mpr","pelp","pal00","fnm","g00","psus","pwos","pwor","pgru","pal99","g99","palp","jgp","ppre","parl","plgm","pmei","phpr","pdrc"],"box":["gk2","g18","gnt","gk1","e02","g17","md1","td0","dpa","cst","phuk","dkm","btd","brb","ath","mgb","rqs"],"token":["tgk2","trna","tuma","tgrn","tmed","tc18","tm19","tcm2","tbbd","tdom","tddu","ta25","trix","tima","tust","tddt","txln","te01","tc17","thou","tcma","takh","tdds","tmm3","taer","tpca","tc16","tkld","tcn2","temn","tema","tsoi","togw","tc15","tbfz","tori","tmm2","tdtk","tfrf","l15","tjvc","tdvd","tgvl","tevg","tc14","tktk","tddn","tm15","tcns","tmd1","tdag","thp3","tjou","tddm","tbth","tbng","thp2","l14","tfth","thp1","tths","tddl","tm14","tmma","tdgm","tddk","tgtc","l13","trtr","tddj","tm13","tavr","tddi","tdka","l12","tisd","tddh","tm12","tnph","tddg","tmbs","tsom","tddf","tm11","troe","tdde","twwk","tddd","tzen","tm10","tarb","tddc","tcon","tdd2","tala","teve","tshm","tmor","tlrw","t10e","tcsp","tugl"],"expansion":["rna","grn","dom","rix","xln","hou","akh","aer","kld","emn","soi","ogw","bfz","dtk","frf","ktk","jou","bng","ths","dgm","gtc","rtr","avr","dka","isd","nph","mbs","som","roe","wwk","zen","arb","con","ala","eve","shm","mor","lrw","fut","plc","tsb","tsp","csp","dis","gpt","rav","sok","bok","chk","5dn","dst","mrd","scg","lgn","ons","jud","tor","ody","apc","pls","inv","pcy","nem","mmq","uds","ulg","usg","exo","sth","tmp","wth","vis","mir","all","hml","ice","fem","drk","leg","atq","arn"],"archenemy":["oe01","e01","oarc","arc","parc"],"planechase":["opca","pca","opc2","pc2","ohop","hop"],"masterpiece":["puma","med","mp2","mps","exp"],"masters":["uma","a25","ima","mm3","ema","mm2","tpr","vma","mma","me4","me3","me2","me1","chr"],"memorabilia":["oc18","htr17","oc17","oc16","oc15","oc14","ppc1","oc13","ocm1","phel","ocmd","pcmd","olgc","wc04","wc03","ovnt","wc02","wc01","wc00","wc99","wc98","wc97","pcel","ptc","cei","ced"],"starter":["ana","w17","w16","cp3","cp2","cp1","s00","s99","ptk","p02","ppod","por","itp"],"spellbook":["ss1"],"funny":["ust","h17","htr","hho","unh","ugl"],"from_the_vault":["v17","v16","v15","v14","v13","v12","v11","v10","v09","drb"],"treasure_chest":["pz2","pz1"],"premium_deck":["pd3","pd2","h09"],"vanguard":["pmoa","pvan"]};

export const NO_CARD_REMAINING_CARD = {
    name: "",
    oracle_text: "",
    image_uris: {border_crop: "https://tapandresolve.com/assets/no_cards_remaining.png"}
};
export const EMPTY_CARD = {
    image_uris: {border_crop: ""},
    likedCount: 0,
    dislikedCount: 0,
    name: "",
    oracle_text: "",
    flavor_text: "",
    set_name: "",
    legalities: {},
    purchase_uris: {},
    uri: false,
    id: false
};
export const DEFAULT_USER_CARD_STATUS = {liked: false, blocked: false};
export const API_URL = "https://api.tapandresolve.tk";
export const JSON_HEADER = {headers: {'Content-type': 'application/json'}};
