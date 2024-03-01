(define-data-var casino int 10)
(define-data-var casinoOdd bool false)
(define-data-var casinoEven bool false)
(define-data-var playerNumber int 10)
(define-data-var playerBet int 100)
(define-data-var playerWin int 0)
(define-data-var betOdd int 0) ;; 1 to bet, 0 to not, choose only one at once
(define-data-var betEven int 1) ;; 1 to bet, 0 to not, choose only one at once

;;check for valid
 (define-public (get-casino)
 (begin
    (var-set casino (if (<= (var-get casino) 36) (var-get casino) 36)) 
    (var-set casino (if (>= (var-get casino) 0) (var-get casino) 0))
    (ok (var-get casino))))
 
 (define-public (get-player-number)
 (begin
    (var-set playerNumber (if (<= (var-get playerNumber) 36) (var-get playerNumber) 36)) 
    (var-set playerNumber (if (>= (var-get playerNumber) 0) (var-get playerNumber) 0))
    (ok (var-get playerNumber)))) 

;;should be more than 0
 (define-public (get-player-bet)
 (begin
    (var-set playerBet (if (>= (var-get playerBet) 0) (var-get playerBet) 0))
    (ok (var-get playerBet))))


 (define-public (get-number-win)
 (begin                         
    (if (is-eq (var-get casino) (var-get playerNumber)) (var-set playerWin (* (var-get playerBet) 35)) (var-set playerWin 0)) 
    (ok (var-get playerWin))))

 (define-public (check-casino-odd)
 (begin
    (if (is-eq (mod (var-get casino) 2) 0) (var-set casinoEven true) (var-set casinoOdd true))
    (if (is-eq (var-get casino) 0) (var-set casinoEven false) false)
    (if (is-eq (var-get casino) 0) (var-set casinoOdd false) false)
    (ok (var-get casinoOdd))))

 (define-public (get-odd-win)
 (begin
  (if (> (var-get betOdd) (var-get betEven)) 
    (if (is-eq (var-get casinoOdd) true) (var-set playerWin (* (var-get playerBet) 2)) (var-set playerWin 0))
    (if (is-eq (var-get casinoEven) true) (var-set playerWin (* (var-get playerBet) 2)) (var-set playerWin 0)))
    (ok (var-get playerWin))))  
  

 (define-public (increment-bet)
    (begin
        (var-set playerBet (+ (var-get playerBet) 10))
    (ok (var-get playerBet))))

 (define-public (decrement-bet)
    (begin
        (var-set playerBet (- (var-get playerBet) 10))
    (ok (var-get playerBet))))

;;this function can help with getting pseudo-random number in future
 (define-public (get-hash)
   (ok (get-block-info? header-hash u2)))