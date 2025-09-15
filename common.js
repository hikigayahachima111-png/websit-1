new Vue({
	el: '#index',
	data: {
		header:'',
		footer:'',
		jsonData: null,
		search:'',
		searchResult:null,
		type:'',
		typeResult:null,
		topCheck:'TOP_FREE_APPS',
		topResult:null,
	},
	watch: {
		jsonData: {
			handler(newVal) {
				if (newVal && Object.keys(newVal).length > 0) {
					// 1️⃣ 触发 URL 搜索
					this.trySearchFromUrl();
					this.topResult = this.jsonData.TOP_FREE_APPS;
				}
			},
			immediate: true,
			deep: true
		}
	},
	mounted() {
		fetch('header.html')
			.then(res => res.text())
			.then(html => {
				this.header = html;
				this.$nextTick(() => {
					// header 内按钮事件绑定
					const btn = document.getElementById('searchIcon');
					if (btn) {
						btn.addEventListener('click', () =>this.searchWord());
					}
					const input = document.getElementById('searchInput');
					if (input) {
						input.value = this.search; // 初始化值
						input.addEventListener('input', (e) => {
							this.search = e.target.value; // 手动同步到 Vue data
						});
					}
				});
			});
		fetch('footer.html')
			.then(res => res.text())
			.then(html => {
				this.footer = html;
			});
		this.getJson();
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
				})
				.catch(err => {
					alert("加载远程 JSON 失败，请检查 URL 或网络。");
				});
		},
		trySearchFromUrl() {
			const searchAppId = new URLSearchParams(window.location.search).get('search');
			if (searchAppId && Object.keys(this.jsonData).length > 0) {
				this.search = searchAppId;
				this.searchResult = this.searchAppById(searchAppId);
				console.log('Search result:', this.searchResult);
			}
			const type = new URLSearchParams(window.location.search).get('type');
			if (type && Object.keys(this.jsonData).length > 0) {
				this.type = type.charAt(0).toUpperCase() + type.slice(1);
				this.typeResult = this.jsonData[type];
				console.log('Type result:', this.typeResult);
			}
			const like = new URLSearchParams(window.location.search).get('like');
			if (like && Object.keys(this.jsonData).length > 0) {
				this.search = like;
				this.searchResult = this.searchAppsByName(like);
				console.log('like result:', this.searchResult);
			}
		},
		searchAppById(appId) {
			for (const categoryKey in this.jsonData) {
				const appsArray = this.jsonData[categoryKey];
				if (!Array.isArray(appsArray)) continue;
				for (const item of appsArray) {
					const app = Object.values(item)[0]; // 跳过一级 key
					if (app.appId === appId) {
						return app;
					}
				}
			}
			return null;
		},
		searchAppsByName(namePart) {
			if (!namePart) return [];
			const lowerNamePart = namePart.toLowerCase();
			const results = [];
			for (const categoryKey in this.jsonData) {
				const appsArray = this.jsonData[categoryKey];
				if (!Array.isArray(appsArray)) continue;
				for (const item of appsArray) {
					const app = Object.values(item)[0]; // 跳过一级 key
					if (app.name && app.name.toLowerCase().includes(lowerNamePart)) {
						results.push(app);
					}
				}
			}

			return results; // 返回所有匹配的 app
		},
		searchWord(){
			window.location.href='search.html?like='+this.search;
			this.trySearchFromUrl();

		},
		choose(flay){
			this.topCheck=flay;
			this.topResult = this.jsonData[flay];
		}
	}
});