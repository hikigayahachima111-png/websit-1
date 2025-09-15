new Vue({
	el: '#index',
	data: {
		jsonData: null
	},
	mounted() {
		this.getJson();
		this.getPage("TOP_FREE")
	},
	methods: {
		getJson() {
			const url = '/app_list.json'; // 替换为你的远程 JSON URL
			fetch(url)
				.then(res => {
					if (!res.ok) throw new Error(`HTTP 错误! 状态码: ${res.status}`);
					return res.json();
				})
				.then(data => {
					this.jsonData = data;
					console.log(this.jsonData)
				})
				.catch(err => {
					console.error("加载远程 JSON 失败:", err);
					alert("加载远程 JSON 失败，请检查 URL 或网络。");
				});
		},
		getPage(val) {
		}
	}
});