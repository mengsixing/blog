# 数据结构分类

## 按逻辑结构分类

* 集合（无逻辑关系）。
* 线性结构（线性表）。
 * 一维数组。
 * 队列。
 * 栈。
* 非线性结构。
 * 树。
 * 图。
 * 多维数组。

## 按存储结构分类

* 顺序存储结构。
* 链式存储结构。
* 索引存储结构。
* 散列存储结构。


## 二叉树代码实现

``` javascript
function Node(data,left,right){
			this.data=data;
			this.left=left;
			this.right=right;
			this.show=show;
		}
function show(){
    console.log(this.data);

}
function BST(){
    this.root=null;
    this.insert=insert;
    this.inOrder=inOrder;
    this.getSmalllest=getSmalllest;
    this.getMax=getMax;
    this.find=find;
    this.remove=remove;
}
function insert(data){
    var n=new Node(data,null,null);
    if(this.root==null){
        this.root=n;
    }else{
        var current=this.root;
        var parent;
        while(true){
            parent=current;
            if(data<current.data){
                current=current.left;
                if(current==null){
                    parent.left=n;
                    break;
                }
            }else{
                current=current.right;
                if(current==null){
                    parent.right=n;
                    break
                }
            }

        }
    }

}
//中序排序
function inOrder(node){
    if(node!=null){
        this.inOrder(node.left);
        console.log(node.data);
        this.inOrder(node.right)
    }
}
function getSmalllest(root){
    var current=root;
    while(true){
        if(!current.left){
            return current;
        }else{
            current=current.left;
        }
    }

}
function getMax(root){
    var current=root;
    while(true){
        if(!current.right){
            return current;
        }else{
            current=current.right;
        }
    }

}
function remove(data){
    removeNode(this.root,data);
}
function find(data){
    var current=this.root;
    while(true){
        if(data<current.data){
            current=current.left;
        }else if(data>current.data){
            current=current.right;
        }else{
            return current;
        }
    }
    return null;

}
function removeNode(node,data){
    if(node==null){
        return null;
    }
    if(data==node.data){
        debugger
        if(node.left==null&&node.right==null){
            return null;
        }
        if(node.left==null&&node.right!=null){
            return node.right;
        }
        if(node.right==null&&node.left!=null){
            return node.right;
        }
        var tempNode=getSmalllest(node.right);
        node.data=tempNode.data;
        node.right=removeNode(node.right,tempNode.data);
        return node;
    }else if(data<node.data){
        node.left=removeNode(node.left,data);
    }else{
        node.right=removeNode(node.right,data);
    }
}



var nums=new BST();
nums.insert(23);
nums.insert(123);
nums.insert(213);
nums.insert(3);
nums.insert(73);
nums.insert(43);
nums.insert(63);
nums.insert(13);
nums.insert(2993);
nums.inOrder(nums.root);
nums.remove(123);
console.warn('删除123以后')
nums.inOrder(nums.root);
//nums.getSmalllest(nums.root);
//nums.getMax(nums.root);
//console.log(nums.find(213));

```

## 散列代码实现

``` javascript
function HashTable(){
    this.table=new Array(137);
    this.simpleHash=simpleHash;
    this.showDistro=showDistro;
    this.put=put;
    this.get=get;
    this.buildChains=buildChains;
}
//开链发解决冲突
function buildChains(){
    for(var i=0;i<this.table.length;i++){
        this.table[i]=new Array();
    }
}
function simpleHash(data){
    var total=0;
    for(var i=0;i<data.length;i++){
        total+=data.charCodeAt(i);
    }
    return total% this.table.length;
}
function betterHash(data){
    var H=31;
    var total=0;
    for(var i=0;i<data.length;i++){
        total+=H*total+data.charCodeAt(i);
    }
    if(total<0){
        total+=this.table.length-1;
    }
    return total% this.table.length;
}
function put(data){
    var pos=this.simpleHash(data);
    //this.table[pos]=data;
    var index=0;
    //开链法
    if(this.table[pos][index]==undefined){
        this.table[pos][index]=data;
        index++;
    }else{
        while(this.table[pos][index]!=undefined){
            ++index;
        }
        this.table[pos][index]=data;
    }

    //线性探测法
    // if(this.table[pos]==undefined){
    // 	this.table[pos]=data;
    // }else{
    // 	while(this.table[pos]!=undefined){
    // 		pos++;
    // 	}
    // }
}
function get(key){
    return this.table[this.simpleHash(key)];
}
function showDistro(){
    var n=0;
    for(var i=0;i<this.table.length;i++){
        if(this.table[i][0]!=undefined){
            console.log('健是：'+i+'，值是：'+this.table[i]);
        }
    }
}

var hTable=new HashTable();
hTable.buildChains();
hTable.put('china');
hTable.put('cainh');
hTable.put('aosdn');
hTable.put('vnvnin');

hTable.showDistro();

```
