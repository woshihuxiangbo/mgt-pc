import request from '@/common/request';

export const ossType = {
    item: 1, // 1、商品图片
    itemBrand: 2, // 2、商品品牌图片
    itemClass: 3, // 3、商品分类图片
    article: 4, // 4、文章图片
    articleClass: 5, // 5、文章分类图片
    adv: 6, // 6、广告图片
    customize: 7, // 7、个性化配置图片
    order: 8, // 8、订单图片
    reply: 9 // 9、评论图片
};

export const subMold = {
    item: 1, // 1、商品图片
    slide: 2, // 2、商品幻灯片
    itemDes: 3, // 3、商品详情
    itemDoc: 4, // 4、商品资质文档
    mini: 5, // 5、商品分享小程序码
};

export const getOssSignature = (type, ID, subMold) => {
    return request.get('/api/oss/m/ossUpload', {params: {type, ID, subMold}});
};

export default {
    getOssSignature,
    ossType,
    subMold
}