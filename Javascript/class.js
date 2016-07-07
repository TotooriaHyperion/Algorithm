// ��ʼ��prototype�;�̬����
function initClass(constructor,_proto) {
	// ����prototype
	for(var key in _proto) {
		constructor.prototype[key] = _proto[key];
		if(typeof _proto[key] == "function") {
			Object.defineProperty(constructor.prototype,key,{"enumerable":false});
		}
	}
	// ΪClass��չ����/���Եĺ���
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
	// ΪClassɾ������/���Եĺ���
	constructor.delete = function(array) {
		array.forEach(function(item){
			delete this.prototype[item];
		});
	}
	// ΪClass��д����/���Եĺ���
	constructor.rewrite = function(key,value) {
		this.prototype[key] = value;
		if(typeof this.prototype[key] == "function") {
			Object.defineProperty(this.prototype,key,{"enumerable":false});
		}
	}
}

// ����һ����,����л���superType,������������
function Class(name,constructor,_proto,superType){
	// ����������ͷ������(nodejs��)
	var Global = Global || window;
	
	if(superType) {
	
		// ����һ��Class�����г�ʼ���͸����ʼ��(��ϼ̳�:ԭ�����̳�+���ù��캯��)
		Global[name] = function (obj) {
			var arg = obj ? obj : {};
			superType.call(this,arg);
			constructor.call(this,arg);
		};
		Global[name].name = name;
		Object.defineProperty(Global[name],"name",{"value":name,"enumerable":false,"writable":false});
		
		// �����̳�
		var pro = Object.create(superType.prototype);
		pro["constructor"] = Global[name];
		Global[name].prototype = pro;
		// ʹ���캯�����ɱ�for-in����,�ų�����
		Object.defineProperty(Global[name].prototype,"constructor",{"enumerable":false});
		// Object.defineProperty(Global[name].prototype,"constructor",{"Enumerable":false});
		// delete Global[name].prototype.constructor;
		
		// ��ʼ��prototype�;�̬����
		initClass(Global[name],_proto);
	
	} else {
		
		// ����һ��Class
		Global[name] = constructor;
		Object.defineProperty(Global[name],"name",{"value":name,"enumerable":false,"writable":false});

		// ��ʼ��prototype�;�̬����
		initClass(Global[name],_proto);
	}
}