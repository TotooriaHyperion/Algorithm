// 初始化prototype和静态方法
function initClass(constructor,_proto) {
	// 配置prototype
	for(var key in _proto) {
		constructor.prototype[key] = _proto[key];
		if(typeof _proto[key] == "function") {
			Object.defineProperty(constructor.prototype,key,{"enumerable":false});
		}
	}
	// 为Class扩展方法/属性的函数
	constructor.extend = function(obj) {
		for(var key in obj) {
			if(this.hasOwnProperty(key)) {
				Error("this property already exist");
			} else {
				this.prototype[key] = obj[key];
				if(typeof obj[key] == "function") {
					Object.defineProperty(this.prototype,key,{"enumerable":false});
				}
			}
		}
	}
	// 为Class删除方法/属性的函数
	constructor.delete = function(array) {
		array.forEach(function(item){
			delete this.prototype[item];
		});
	}
	// 为Class重写方法/属性的函数
	constructor.rewrite = function(key,value) {
		this.prototype[key] = value;
		if(typeof this.prototype[key] == "function") {
			Object.defineProperty(this.prototype,key,{"enumerable":false});
		}
	}
}

// 声明一个类,如果有基类superType,则生成其子类
function Class(name,constructor,_proto,superType){
	// 适配浏览器和非浏览器(nodejs等)
	var Global = Global || window;
	
	if(superType) {
	
		// 创建一个Class并进行初始化和父类初始化(组合继承:原型链继承+借用构造函数)
		Global[name] = function (obj) {
			var arg = obj ? obj : {};
			superType.call(this,arg);
			constructor.call(this,arg);
		};
		Global[name].name = name;
		Object.defineProperty(Global[name],"name",{"value":name,"enumerable":false,"writable":false});
		
		// 寄生继承
		var pro = Object.create(superType.prototype);
		pro["constructor"] = Global[name];
		Global[name].prototype = pro;
		// 使构造函数不可被for-in遍历,排除干扰
		Object.defineProperty(Global[name].prototype,"constructor",{"enumerable":false});
		// Object.defineProperty(Global[name].prototype,"constructor",{"Enumerable":false});
		// delete Global[name].prototype.constructor;
		
		// 初始化prototype和静态方法
		initClass(Global[name],_proto);
	
	} else {
		
		// 创建一个Class
		Global[name] = constructor;
		Object.defineProperty(Global[name],"name",{"value":name,"enumerable":false,"writable":false});

		// 初始化prototype和静态方法
		initClass(Global[name],_proto);
	}
}