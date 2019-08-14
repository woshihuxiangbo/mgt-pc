const types = {
    SET_IMG_SIZE : 'SET_IMG_SIZE', //设置content部分的宽高
}

const state = {
   imgSize:{
	   width:200,
	   height:200
   }
}

const getters = {
    imgSize: state => state.imgSize,
}

const mutations = {
    [types.SET_IMG_SIZE] (state, size) {  
		state.imgSize = size
    },  
}

const actions = {
	setImgSize:({ commit },size) => {
        commit(types.SET_IMG_SIZE, size)  
    },
}

export default  {
    state,
    getters,
    mutations,
    actions
}