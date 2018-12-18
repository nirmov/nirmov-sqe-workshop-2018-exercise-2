import {getMapColors} from './symbolic';
import {drawGraph} from './app';
export {startGraph};
let line=1;
var next;
var index=0;
var objects={};
var Whilenode;
function startGraph(exprimaCode)
{
    objects=[];
    index=0;
    next=undefined;
    Whilenode=undefined;
    indexColor=0;
    var nodeTrue={};
    nodeTrue.lines=[];
    nodeTrue.type='square';
    nodeTrue.isTrue=true;
    nodeTrue.index=index;
    index++;
    colorArray= getMapColors();
    parseNewCode(exprimaCode,nodeTrue,undefined,true,1);
    getObjects(nodeTrue);
    var draw=printGraph();
    drawGraph(draw);

}
function printGraph()
{
    var oprands='';
    for (let i=0;i<objects.length;i++)
    {
        var node=objects[i];
        var color=getColorNode(node);
        if (node.type=='square')
            oprands+= 'op'+node.index+'=>operation: '+node.lines+'|'+color+'\n';
        else if (node.type=='meoyan')
            oprands+= 'op'+node.index+'=>condition: '+node.lines+'|'+color+'\n';
        else
            oprands+= 'op'+node.index+'=>inputoutput: |'+color+'\n';
    }
    return addKshatot(oprands);

}
function addKshatot(oprands)
{
    for (let i=0;i<objects.length;i++) {
        var node=objects[i];
        var nodeName='op'+node.index;
        if (node.type=='meoyan') {
            if (node.true!=undefined) {
                var nodeTrue='op'+node.true.index;
                if (node.true.isTrue)
                    oprands+=nodeName+'(yes)->'+nodeTrue+'\n';
                else
                    oprands+=nodeName+'(yes,right)->'+nodeTrue+'\n';
            }
            if (node.false!=undefined) {
                var nodeFalse='op'+node.false.index;
                if (node.false.isTrue)
                    oprands+=nodeName+'(no)->'+nodeFalse+'\n';
                else
                    oprands+=nodeName+'(no,left)->'+nodeFalse+'\n';
            }
        }
        if (node.next!=undefined) {
            var nodeNext = 'op' + node.next.index;
            oprands+=nodeName+'->'+nodeNext+'\n';
        }
    }
    return oprands;
}
function getColorNode(node)
{
    if (node.isTrue==true)
        return 'green';
    else
        return 'white';
}
function getObjects(node)
{

    if (node!=undefined)
    {
        if (objects[node.index]==undefined) {
            objects[node.index]=node;
            getObjects(node.next);
            getObjects(node.true);
            getObjects(node.false);
        }
    }
}
function parseNewCode(parsedCode,curentNode,NextNode,isTrue,lineIn) {
    if (lineIn!=undefined)
        line=lineIn;
    if (parsedCode != null && parsedCode.type != null) {
        switch (parsedCode.type) {
        case 'FunctionDeclaration':return handleFunctionDeclaration(parsedCode,curentNode,NextNode,isTrue);
        default:return handleNext(parsedCode,curentNode,NextNode,isTrue);
        }
    } else
        return null;
}

function handleNext(parsedCode,curentNode,NextNode,isTrue) {
    switch (parsedCode.type) {
    case 'VariableDeclarator':return handleVariableDeclarator(parsedCode,curentNode,NextNode,isTrue);
    case 'BlockStatement':return handleBlockStatement(parsedCode,curentNode,NextNode,isTrue);
    case 'ExpressionStatement':return handleExpressionStatement(parsedCode,curentNode,NextNode,isTrue);
    case 'UpdateExpression': return HandleUpdateExpression(parsedCode,curentNode,NextNode,isTrue);
    default:return handleSecond(parsedCode,curentNode,NextNode,isTrue);
    }
}
function handleSecond(parsedCode,curentNode,NextNode,isTrue) {
    switch (parsedCode.type) {
    case 'AssignmentExpression':return handleAssignmentExpression(parsedCode,curentNode,NextNode,isTrue);
    case 'WhileStatement':return handleWhileStatement(parsedCode,curentNode,NextNode,isTrue);
    case 'BinaryExpression':return handleBinaryExpression(parsedCode,curentNode,NextNode,isTrue);
    case 'Identifier':return handleIdentifier(parsedCode,curentNode,NextNode,isTrue);
    default:return handleThird(parsedCode,curentNode,NextNode,isTrue);
    }
}

function handleThird(parsedCode,curentNode,NextNode,isTrue) {
    switch (parsedCode.type) {
    case 'Literal':return handleLiteral(parsedCode,curentNode,NextNode,isTrue);
    case 'ElseIfStatment':return handleElseIfStatment(parsedCode,curentNode,NextNode,isTrue);
    case 'ReturnStatement':return handleReturnStatement(parsedCode,curentNode,NextNode,isTrue);
    case 'UnaryExpression':return handleUnaryExpression(parsedCode,curentNode,NextNode,isTrue);
    default:return handleForth(parsedCode,curentNode,NextNode,isTrue);
    }
}

function handleForth(parsedCode,curentNode,NextNode,isTrue) {
    switch (parsedCode.type) {
    case 'IfStatement':return handleIfStatement(parsedCode,curentNode,NextNode,isTrue, 'if statment');
    case 'VariableDeclaration':return handleVariableDeclaration(parsedCode,curentNode,NextNode,isTrue);
    case 'Program':return handleProgram(parsedCode,curentNode,NextNode,isTrue);
    case 'LogicalExpression': return handleLogicalExpression(parsedCode);
    default:return handleMemberExpression(parsedCode,curentNode,NextNode,isTrue);
    }
}
function handleProgram(parsedCode,curentNode,NextNode,isTrue) {
    let toReturn = [];
    var i;
    for (i = 0; i < parsedCode.body.length; i++) {
        Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.body[i],curentNode,NextNode,isTrue));
    }
    let to=[];
    to[0]=toReturn;
    return to;
}
function handleLogicalExpression(parsedCode)
{
    var left = parseNewCode(parsedCode.left);
    var right = parseNewCode(parsedCode.right);
    return '('+ left+ parsedCode.operator + right+')';
}
function handleFunctionDeclaration(parsedCode,curentNode,NextNode,isTrue) {
    let toReturn = [];
    toReturn[0] = {};
    addToObj(toReturn[0], line, 'function declaration', parseNewCode(parsedCode.id,curentNode,NextNode,isTrue), '', '');
    var i;
    for (i = 0; i < parsedCode.params.length; i++) {
        toReturn[i + 1] = {};
        //addToObj(toReturn[i + 1], line, 'variable declaration', parseNewCode(parsedCode.params[i],curentNode,NextNode,isTrue), '', '');
    }
    line += 1;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.body,curentNode,NextNode,isTrue));
    return toReturn;
}

function handleVariableDeclaration(parsedCode,curentNode,NextNode,isTrue) {
    var toReturn = [];
    var i;
    for (i = 0; i < parsedCode.declarations.length; i++) {
        toReturn[i] = {};
        var objReturned = parseNewCode(parsedCode.declarations[i],curentNode,NextNode,isTrue);
        curentNode.lines.push(objReturned.name+' = ' + objReturned.value);
        curentNode.isTrue=isTrue;
        addToObj(toReturn[i], line, 'variable declaration', objReturned.name, objReturned.condition, objReturned.value);
    }
    line += 1;
    return toReturn;
}

function handleVariableDeclarator(parsedCode) {
    var obj = {};
    obj.name = parseNewCode(parsedCode.id);
    obj.condition = '';
    obj.value = parseNewCode(parsedCode.init);
    return obj;
}

function handleBlockStatement(parsedCode,curentNode,NextNode,isTrue) {
    var toReturn = [];
    var i;
    for (i = 0; i < parsedCode.body.length; i++) {
        var mid = parseNewCode(parsedCode.body[i],curentNode,NextNode,isTrue);
        if (next!=undefined)
        {
            curentNode=next;
            next=undefined;
        }
        if (Whilenode!=undefined)
        {
            curentNode=Whilenode;
            var newNode={};
            newNode.lines=[];
            newNode.type='square';
            newNode.isTrue=true;
            newNode.index=index;
            index++;
            curentNode.false=newNode;
            curentNode=newNode;
            Whilenode=undefined;
        }
        Array.prototype.push.apply(toReturn, mid);
    }
    return toReturn;
}

function handleExpressionStatement(parsedCode,curentNode,NextNode,isTrue) {

    var toReturn = [];
    toReturn[0] = parseNewCode(parsedCode.expression,curentNode,NextNode,isTrue);
    line += 1;
    return toReturn;
}


function handleAssignmentExpression(parsedCode,curentNode,NextNode,isTrue) {
    var obj = {};
    var left =parseNewCode(parsedCode.left);
    var right =parseNewCode(parsedCode.right);
    addToObj(obj, line, 'assignment expression', left, '', right);
    curentNode.lines.push(left+' = ' + right);
    curentNode.isTrue=isTrue;
    return obj;
}

function handleWhileStatement(parsedCode,curentNode,NextNode,isTrue) {
    var toReturn = [];
    toReturn[0] = {};
    var test= parseNewCode(parsedCode.test,curentNode,NextNode,isTrue);
    addToObj(toReturn[0], line, 'while statment', '', test, '');
    line++;
    var newNode={};
    newNode.lines=[];
    newNode.type='meoyan';
    newNode.next=NextNode;
    newNode.lines.push(test);
    newNode.index=index;
    newNode.isTrue=isTrue;
    index++;
    curentNode.next=newNode;
    NextNode=newNode;
    var trueNode={};
    trueNode.lines=[];
    trueNode.type='square';
    trueNode.next=NextNode;
    trueNode.index=index;
    trueNode.isTrue=isTrue;
    newNode.true=trueNode;
    index++;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.body,trueNode,NextNode,isTrue));
    Whilenode=newNode;
    return toReturn;
}
function handleBinaryExpression(parsedCode) {
    var left = parseNewCode(parsedCode.left);
    var right = parseNewCode(parsedCode.right);
    return '('+ left+ parsedCode.operator + right+')';
}

function handleIdentifier(parsedCode) {
    return parsedCode.name;
}

function handleLiteral(parsedCode) {
    if (isNaN(parsedCode.value)) {
        return '\'' + parsedCode.value + '\'';
    }
    return parsedCode.value;
}

function handleElseIfStatment(parsedCode,curentNode,NextNode,isTrue) {
    var toReturn = [];
    toReturn[0] = {};
    var condition=parseNewCode(parsedCode.test,curentNode,NextNode,isTrue);
    addToObj(toReturn[0], line, 'else if statment', '', condition, '');
    curentNode.isTrue=isTrue;
    curentNode.lines.push(condition);
    curentNode.type='meoyan';
    var nodeTrue={};
    nodeTrue.lines=[];
    nodeTrue.index=index;
    index++;
    nodeTrue.type='square';
    nodeTrue.isTrue=curentNode.isTrue;
    nodeTrue.next=NextNode;
    curentNode.true=nodeTrue;
    line++;
    var trueIf=isTrue;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.consequent,nodeTrue,NextNode,curentNode.isTrue));
    if (parsedCode.alternate != null) {
        var nodeFalse={};
        nodeFalse.lines=[];
        nodeFalse.index=index;
        index++;
        if (parsedCode.alternate.type == 'IfStatement')
            parsedCode.alternate.type = 'ElseIfStatment';

        else {
            toReturn[toReturn.length] = {};
            addToObj(toReturn[toReturn.length - 1], line, 'else', '', '', '');
            line++;
            nodeFalse.type='square';
            nodeFalse.next=NextNode;
            trueIf=getIsTrue();
            nodeFalse.isTrue=trueIf;
        }
        curentNode.false=nodeFalse;
        Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.alternate,nodeFalse,NextNode,trueIf));
    }
    return toReturn;
}

function handleIfStatement(parsedCode,curentNode,NextNode,isTrue, type) {
    var toReturn = [];
    toReturn[0] = {};
    var newNode={};
    newNode.lines=[];
    var condition=parseNewCode(parsedCode.test,curentNode,NextNode,isTrue);
    addToObj(toReturn[0], line, type, '', condition, '');
    var trueIf=getIsTrue();
    newNode.isTrue=isTrue;
    newNode.lines.push(condition);
    newNode.type='meoyan';
    newNode.index=index;
    index++;
    var nextNode={};
    nextNode.type='circle';
    nextNode.index=index;
    nextNode.next=NextNode;
    index++;
    curentNode.next=newNode;
    var nodeTrue={};
    nodeTrue.lines=[];
    nodeTrue.type='square';
    nodeTrue.index=index;
    index++;
    nodeTrue.isTrue=curentNode.isTrue;
    nodeTrue.next=nextNode;
    nextNode.isTrue=isTrue;
    newNode.true=nodeTrue;
    line++;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.consequent,nodeTrue,nextNode,trueIf));
    if (parsedCode.alternate != null) {
        var nodeFalse={};
        nodeFalse.lines=[];
        nodeFalse.index=index;
        index++;
        if (!(parsedCode.alternate.type == 'ElseIfStatment')){
            toReturn[toReturn.length] = {};
            addToObj(toReturn[toReturn.length - 1], line, 'else', '', '', '');
            line++;
            nodeFalse.type='square';
            nodeFalse.next=nextNode;
        }
        nodeFalse.isTrue=curentNode.isTrue;
        newNode.false=nodeFalse;
        trueIf=getIsTrue();
        nodeFalse.isTrue=trueIf;
        Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.alternate,nodeFalse,nextNode,trueIf));
    }
    next=nextNode;
    return toReturn;
}
var colorArray;
var indexColor=0;
function getIsTrue()
{
    var to=colorArray[indexColor];
    indexColor++;
    return to;
}
function handleReturnStatement(parsedCode,curentNode,NextNode,isTrue) {
    var toReturn = [];
    toReturn[0] = {};
    var newNode={};
    newNode.lines=[];
    newNode.index=index;
    index++;
    var argument=parseNewCode(parsedCode.argument);
    addToObj(toReturn[0], line, 'return statment', '', '',argument);
    newNode.lines.push('return '+ argument);
    newNode.isTrue=isTrue;
    newNode.type='square';
    curentNode.next=newNode;
    //curentNode=newNode;
    line++;
    return toReturn;
}

function handleUnaryExpression(parsedCode) {
    var toReturn = parseNewCode(parsedCode.argument);
    var to = parsedCode.operator + toReturn;
    return to;
}

function handleMemberExpression(parsedCode) {
    return parseNewCode(parsedCode.object) + '[' + parseNewCode(parsedCode.property) + ']';
}

function addToObj(obj, line, type, name, condition, value) {
    obj.line = line;
    obj.type = type;
    obj.name = name;
    obj.condition = condition;
    obj.value = value;
}
function HandleUpdateExpression(parsedCode)
{
    var toReturn=[];
    toReturn[0]={};
    addToObj(toReturn[0],line,'update expression',parseNewCode(parsedCode.argument),'',parsedCode.operator);
    return toReturn;
}