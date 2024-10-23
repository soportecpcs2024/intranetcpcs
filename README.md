# test_mern_render

https://www.youtube.com/watch?v=-PHi1w1elxU&ab_channel=FaztCode


https://www.youtube.com/watch?v=AF2gywytBzs&ab_channel=ProgramandoconDanCruise


Colores degradados :
https://mybrandnewlogo.com/es/generador-de-gradiente-de-color

boxshadow
https://getcssscan.com/css-box-shadow-examples

https://www.youtube.com/watch?v=_5HMNZsm6xE&list=PLP7LlHfxfuM843Lg9F3iUSU7ZJCEh8GxN&index=16&ab_channel=AlexCGDesign


pdf modejs  
https://www.youtube.com/watch?v=otajcFDAd04

 # Comprar CALL si la apertura y el cierre de la vela anterior son mayores que la SMA
        if apertura_anterior > sma_12 and cierre_anterior > sma_12 and minimo > sma_12:
            print(f"Condiciones cumplidas para CALL (Open: {apertura_anterior}, Close: {cierre_anterior}, SMA: {sma_12})")
            compra(valor_invertir, activo, 'call')

        # Comprar PUT si la apertura y el cierre de la vela anterior son menores que la SMA
        elif apertura_anterior < sma_12 and cierre_anterior < sma_12 and maximo < sma_12:
            print(f"Condiciones cumplidas para PUT (Open: {apertura_anterior}, Close: {cierre_anterior}, SMA: {sma_12})")
            compra(valor_invertir, activo, 'put')