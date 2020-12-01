class Comment_remover{
    constructor(){
      this.curr_state = 'initial';
      this.filtered_text = '';
      this.type_of_str = '';
    }
    step_forward(ch) {
      if (this.curr_state==='initial') {
        if (ch==='/') {
          //возможный многострочный комментарий
          this.curr_state = 'prob-comment';
        }
        else {
          if (ch==='"') {
            this.curr_state = 'in-str-1';
            this.type_of_str = 'in-str-1';
          }
          if (ch==="'") {
            this.curr_state = 'in-str-2';
            this.type_of_str = 'in-str-2';
          }
          if (ch==='`') {
            this.curr_state = 'in-str-3';
            this.type_of_str = 'in-str-3';
          }
          this.filtered_text+=ch;
        }
      }
      else if (this.curr_state==='prob-comment'){
       if (ch==='/'){
          this.curr_state = 'single-line-comment';
        }
        else if (ch==='*'){
          this.curr_state = 'multi-line-comment';
        }
        else {
          this.filtered_text+='/'
          this.filtered_text+=ch;
          this.curr_state = 'initial';
        }
      }
      else if (this.curr_state==='single-line-comment'){
        if (ch==='\n'){
          this.curr_state = 'initial';
        }
      }
      else if (this.curr_state==='multi-line-comment'){
        if (ch==='*'){
          this.curr_state='multi-line-comment-end';
        }
      }
      else if (this.curr_state==='multi-line-comment-end'){
        if (ch==='/'){
          this.curr_state='initial';
        } else {
          this.curr_state='multi-line-comment';
        }
      }
      else if (this.curr_state === 'in-str-1'){
        if (ch==='"'){
          this.curr_state='initial';
        }
        if (ch === '\\'){
          this.curr_state='escaping-chars'
        }
        this.filtered_text+=ch;
      }
      else if (this.curr_state === 'in-str-2'){
        if (ch==="'"){
          this.curr_state='initial';
        }
        if (ch === '\\'){
          this.curr_state='escaping-chars';
        }
        this.filtered_text+=ch;
      }
      else if (this.curr_state === 'in-str-3'){
        if (ch==='`'){
          this.curr_state='initial';
        }
        if (ch === '\\'){
          this.curr_state='escaping-chars'
        }
        this.filtered_text+=ch;
      }
      else if (this.curr_state === 'escaping-chars'){
         this.curr_state = this.type_of_str;
         this.filtered_text +=ch;
      }
      return;
    }
  transform(str){
   for (let i = 0; i < str.length; i++) {
    this.step_forward(str[i]);
   }
   //alert(this.filtered_text);
   return this.filtered_text;
  }
 }
let valid_code = `
#include<cstdio>
/*
* Это пример вполне валидного кода на С++
* Хочется из него удалить комментарии...
* В том числе однострочные, которые начинаются с // */
int main(int argc, char**argv) {
 // Здесь продемонстрировано, что строки используют символ " как символ их начала и конца
 /* А символ \\ используется для экранизации специальных символов, например вот так: \\" */
 printf("C++ code can contain single-line comments in form of \\"'// comment\\\\n\\"\\n");
 printf("C++ code can contain multiline comments in form of '/* comment */'\\n");
 printf("C++ code can contain strings with escaped symbols: \\"\\\\ - backslash \\n - end of line\\"");
 // Многострочные комментарии, начинающиеся с /* тоже должны быть удалены
return 0;
}
`;
function demo(func){
 let str = String(func);
 //console.log(str);
 //console.log('---')
 let res = ''
 let remover = new Comment_remover();
 res = remover.transform(str);
 return res;
}
console.log(demo(valid_code));
